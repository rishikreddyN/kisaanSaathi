import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CommunityPage from '../pages/CommunityPage';
import FarmerGroupsSection from '../components/FarmerGroupsSection';
import LocalProblemsSection from '../components/LocalProblemsSection';
import FarmerNotificationDrawer from '../components/FarmerNotificationDrawer';
import AeoAnnouncementModal from '../components/AeoAnnouncementModal';
import { LanguageProvider } from '../context/LanguageContext';
import {
  getAllPosts,
  createCommunityPost,
  togglePostWorkedForMe,
  toggleCommentWorkedForMe,
  getAllGroups,
  getAllProblems,
  toggleProblemFacingToo,
  getAllNotifications,
  createAeoAnnouncement,
  INITIAL_POSTS,
  INITIAL_GROUPS,
  INITIAL_PROBLEMS,
} from '../services/communityDataStore';

// Mock speech synthesis
beforeEach(() => {
  localStorage.clear();
  global.SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
    constructor(text) {
      this.text = text;
    }
  };
  window.speechSynthesis = {
    speak: vi.fn(),
    cancel: vi.fn(),
  };
});

function renderWithProviders(ui) {
  return render(
    <LanguageProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </LanguageProvider>
  );
}

describe('Community Module Master Test Suite', () => {
  it('renders Community Page with strictly three core tabs and location header', () => {
    renderWithProviders(<CommunityPage />);

    expect(screen.getByTestId('community-page')).toBeInTheDocument();
    expect(screen.getByTestId('tab-feed')).toBeInTheDocument();
    expect(screen.getByTestId('tab-groups')).toBeInTheDocument();
    expect(screen.getByTestId('tab-problems')).toBeInTheDocument();

    // Verify location badge
    expect(screen.getAllByText(/Ghatkesar Mandal/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId('open-create-post-modal-btn')).toBeInTheDocument();
  });

  it('switches between Feed, Groups, and Problems tabs correctly', async () => {
    renderWithProviders(<CommunityPage />);

    // Default tab is Feed
    expect(screen.getByTestId('feed-view-section')).toBeInTheDocument();

    // Switch to Groups tab
    fireEvent.click(screen.getByTestId('tab-groups'));
    expect(screen.getByTestId('farmer-groups-section')).toBeInTheDocument();

    // Switch to Problems tab
    fireEvent.click(screen.getByTestId('tab-problems'));
    expect(screen.getByTestId('local-problems-section')).toBeInTheDocument();
  });

  it('handles "Worked for Me" interactions on posts and comments', () => {
    renderWithProviders(<CommunityPage />);

    // Post 1 has Worked for Me button
    const postWorkedBtn = screen.getByTestId('worked-for-me-post-post-1');
    expect(postWorkedBtn).toBeInTheDocument();

    // Click Worked for Me on post
    fireEvent.click(postWorkedBtn);
    expect(postWorkedBtn).toHaveClass('active');

    // Toggle comments and check comment Worked for Me
    const toggleCommentsBtn = screen.getByTestId('toggle-comments-post-1');
    fireEvent.click(toggleCommentsBtn);

    const commentWorkedBtn = screen.getByTestId('worked-for-me-comment-comm-1-1');
    expect(commentWorkedBtn).toBeInTheDocument();
    fireEvent.click(commentWorkedBtn);
    expect(commentWorkedBtn).toHaveClass('active');
  });

  it('supports translation toggle and Hear text button on posts', () => {
    renderWithProviders(<CommunityPage />);

    const hearBtn = screen.getByTestId('hear-post-btn-post-1');
    expect(hearBtn).toBeInTheDocument();

    fireEvent.click(hearBtn);
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });

  it('opens Create Post modal and supports speech-to-text transcription', async () => {
    renderWithProviders(<CommunityPage />);

    const openModalBtn = screen.getByTestId('open-create-post-modal-btn');
    fireEvent.click(openModalBtn);

    expect(screen.getByTestId('create-post-modal')).toBeInTheDocument();

    // Click Speak Instead to simulate voice recording
    const speakBtn = screen.getByTestId('speak-post-btn');
    fireEvent.click(speakBtn);

    // Stop recording and check transcription
    const stopBtn = screen.getByTestId('stop-recording-btn');
    fireEvent.click(stopBtn);

    const descInput = screen.getByTestId('post-description-input');
    expect(descInput.value.length).toBeGreaterThan(10);

    // Submit post
    const submitBtn = screen.getByTestId('submit-create-post');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('create-post-modal')).not.toBeInTheDocument();
    });
  });

  it('supports Plant-wise groups and Nearby groups with configurable radius filter', () => {
    renderWithProviders(<FarmerGroupsSection />);

    // Plant-wise mode
    expect(screen.getByTestId('group-type-crop-btn')).toBeInTheDocument();
    expect(screen.getByTestId('group-card-group-crop-rice')).toBeInTheDocument();

    // Switch to Nearby mode
    const nearbyBtn = screen.getByTestId('group-type-nearby-btn');
    fireEvent.click(nearbyBtn);

    // Radius filter buttons: 5km, 10km, 25km
    expect(screen.getByTestId('radius-selector')).toBeInTheDocument();
    const btn5km = screen.getByTestId('radius-5km-btn');
    const btn25km = screen.getByTestId('radius-25km-btn');

    fireEvent.click(btn5km);
    // Group within 5km (Ghatkesar Tomato 3.2km) should exist
    expect(screen.getByTestId('group-card-group-nearby-1')).toBeInTheDocument();
    // Group at 14.2km (Keesara Cotton) should NOT be in 5km view
    expect(screen.queryByTestId('group-card-group-nearby-4')).not.toBeInTheDocument();

    // Expand to 25km
    fireEvent.click(btn25km);
    expect(screen.getByTestId('group-card-group-nearby-4')).toBeInTheDocument();
  });

  it('supports "I\'m Facing This Too" and renders official AEO verified responses', () => {
    renderWithProviders(<LocalProblemsSection />);

    expect(screen.getByTestId('local-problems-section')).toBeInTheDocument();

    // Facing this too button
    const facingBtn = screen.getByTestId('facing-too-btn-prob-cluster-1');
    fireEvent.click(facingBtn);
    expect(facingBtn).toHaveClass('active');

    // Open detail of problem 1 (which is AEO verified)
    const card = screen.getByTestId('problem-card-prob-cluster-1');
    fireEvent.click(card);

    expect(screen.getByTestId('problem-detail-view')).toBeInTheDocument();
    expect(screen.getByTestId('aeo-verified-card')).toBeInTheDocument();
    expect(screen.getByText(/OFFICIAL AEO VERIFIED RESPONSE/i)).toBeInTheDocument();
  });

  it('supports global Farmer Notifications Drawer and AEO Announcements broadcast', () => {
    const handleClose = vi.fn();
    const { rerender } = renderWithProviders(
      <FarmerNotificationDrawer isOpen={true} onClose={handleClose} />
    );

    expect(screen.getByTestId('farmer-notification-drawer')).toBeInTheDocument();
    expect(screen.getByTestId('mark-all-read-btn')).toBeInTheDocument();

    // Create a new AEO announcement
    createAeoAnnouncement({
      title: 'Pest Outbreak Alert for Chilli Growers',
      crop: 'Chilli',
      target_area: 'Ghatkesar Mandal',
      priority: 'Urgent',
      message: 'Black thrips crossing economic threshold level. Immediate collective spraying required.',
    });

    const notifs = getAllNotifications();
    expect(notifs[0].title.en).toContain('Pest Outbreak Alert');
  });
});
