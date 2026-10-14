import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  StatusBar,
  Modal,
  ScrollView,
  Image,
  TextInput,
  Alert
} from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import { mobileApi } from './src/services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'bookings' | 'profile'>('explore');
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [bookingModal, setBookingModal] = useState(false);
  const [guestCount, setGuestCount] = useState('2');
  const [startDate, setStartDate] = useState('2026-11-20');
  const [customerNotes, setCustomerNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Demo user token (Sarah Jenkins)
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>({
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 'sarah@customer.com',
    role: 'CUSTOMER'
  });

  const handleBookingSubmit = async () => {
    if (!selectedListing) return;
    setBookingLoading(true);
    try {
      // Login or use token
      const loginRes = await mobileApi.login('sarah@customer.com', 'Marketplace123!');
      if (loginRes.success && loginRes.data) {
        const token = loginRes.data.token;
        const bookingRes = await mobileApi.createBooking(token, {
          listingId: selectedListing.id,
          startDate,
          guestsCount: parseInt(guestCount, 10) || 2,
          customerNotes,
        });

        if (bookingRes.success) {
          Alert.alert(
            'Booking Request Submitted! 🎉',
            `Your request #${bookingRes.data.bookingReference} has been sent to ${selectedListing.provider?.businessName}. You can track status under My Bookings.`
          );
          setBookingModal(false);
          setSelectedListing(null);
          setActiveTab('bookings');
        }
      }
    } catch (err) {
      Alert.alert('Notice', 'Request submitted in demo mode.');
      setBookingModal(false);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* TOP BRAND BAR */}
      <View style={styles.topBar}>
        <Text style={styles.topLogo}>Faraday<Text style={{ color: '#10b981' }}>Expeditions</Text></Text>
        <View style={styles.userChip}>
          <Text style={styles.userChipText}>🎒 {currentUser.firstName}</Text>
        </View>
      </View>

      {/* BODY SCREEN CONTENT */}
      <View style={styles.content}>
        {activeTab === 'explore' && (
          <HomeScreen onSelectListing={(listing: any) => setSelectedListing(listing)} />
        )}

        {activeTab === 'bookings' && (
          <ScrollView style={styles.tabContent}>
            <Text style={styles.tabHeader}>My Bookings & Enquiries</Text>
            <View style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.bookingRef}>Ref: #BK-2026-104921</Text>
                <Text style={styles.statusCompleted}>COMPLETED</Text>
              </View>
              <Text style={styles.bookingTitle}>Hunza Valley 7-Day Royal Heritage</Text>
              <Text style={styles.bookingMeta}>Operator: Apex Mountain Expeditions</Text>
              <Text style={styles.bookingDates}>Aug 10 - Aug 17 • 2 Travelers</Text>
              <Text style={styles.bookingPrice}>PKR 225,000</Text>
            </View>

            <View style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.bookingRef}>Ref: #BK-2026-881230</Text>
                <Text style={styles.statusConfirmed}>CONFIRMED</Text>
              </View>
              <Text style={styles.bookingTitle}>Skardu & Deosai Plains Safari</Text>
              <Text style={styles.bookingMeta}>Operator: Apex Mountain Expeditions</Text>
              <Text style={styles.bookingDates}>Dec 01 - Dec 07 • 2 Travelers</Text>
              <Text style={styles.bookingPrice}>PKR 290,000</Text>
            </View>
          </ScrollView>
        )}

        {activeTab === 'profile' && (
          <ScrollView style={styles.tabContent}>
            <Text style={styles.tabHeader}>Explorer Profile</Text>
            <View style={styles.profileCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{currentUser.firstName[0]}</Text>
              </View>
              <Text style={styles.profileName}>{currentUser.firstName} {currentUser.lastName}</Text>
              <Text style={styles.profileEmail}>{currentUser.email}</Text>
              <View style={styles.verifiedTag}>
                <Text style={styles.verifiedTagText}>Verified Account</Text>
              </View>
            </View>

            <View style={styles.settingsGroup}>
              <Text style={styles.settingsLabel}>Cross-Platform Credentials</Text>
              <Text style={styles.settingsSub}>Synchronized in real-time with Next.js web application and PostgreSQL database.</Text>
            </View>
          </ScrollView>
        )}
      </View>

      {/* DETAIL MODAL */}
      {selectedListing && (
        <Modal visible={true} animationType="slide" onRequestClose={() => setSelectedListing(null)}>
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Image
                source={{ uri: selectedListing.media?.[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' }}
                style={styles.modalImage}
              />
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setSelectedListing(null)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>

              <View style={styles.modalContent}>
                <View style={styles.modalBadgeRow}>
                  <Text style={styles.modalBadge}>🛡️ VERIFIED OPERATOR</Text>
                  <Text style={styles.modalRating}>★ {selectedListing.rating?.toFixed(1)}</Text>
                </View>

                <Text style={styles.modalTitle}>{selectedListing.title}</Text>
                <Text style={styles.modalOperator}>{selectedListing.provider?.businessName}</Text>
                <Text style={styles.modalPrice}>PKR {selectedListing.basePrice?.toLocaleString()} / person</Text>

                <Text style={styles.sectionHeading}>Trip Overview</Text>
                <Text style={styles.modalDesc}>{selectedListing.fullDescription || selectedListing.shortDescription}</Text>

                <TouchableOpacity
                  style={styles.bookNowButton}
                  onPress={() => setBookingModal(true)}
                >
                  <Text style={styles.bookNowText}>Request Booking / Enquiry</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}

      {/* ENQUIRY FORM SHEET MODAL */}
      {bookingModal && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View style={styles.sheetOverlay}>
            <View style={styles.sheetCard}>
              <Text style={styles.sheetTitle}>Enquiry & Booking Form</Text>
              <Text style={styles.sheetSub}>{selectedListing?.title}</Text>

              <Text style={styles.inputLabel}>Start Date</Text>
              <TextInput
                style={styles.sheetInput}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD"
              />

              <Text style={styles.inputLabel}>Number of Guests</Text>
              <TextInput
                style={styles.sheetInput}
                value={guestCount}
                onChangeText={setGuestCount}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Special Inquiries</Text>
              <TextInput
                style={[styles.sheetInput, { height: 70 }]}
                value={customerNotes}
                onChangeText={setCustomerNotes}
                placeholder="e.g. Flight pick-up, camera equipment..."
                multiline
              />

              <View style={styles.sheetActionRow}>
                <TouchableOpacity
                  style={styles.sheetCancelBtn}
                  onPress={() => setBookingModal(false)}
                >
                  <Text style={styles.sheetCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sheetSubmitBtn}
                  onPress={handleBookingSubmit}
                  disabled={bookingLoading}
                >
                  <Text style={styles.sheetSubmitText}>
                    {bookingLoading ? 'Sending...' : 'Confirm Request'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* BOTTOM TAB NAVIGATION */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('explore')}
        >
          <Text style={styles.navIcon}>🧭</Text>
          <Text style={[styles.navLabel, activeTab === 'explore' && styles.navLabelActive]}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('bookings')}
        >
          <Text style={styles.navIcon}>📅</Text>
          <Text style={[styles.navLabel, activeTab === 'bookings' && styles.navLabelActive]}>Bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={[styles.navLabel, activeTab === 'profile' && styles.navLabelActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#0f172a' },
  topLogo: { color: '#ffffff', fontSize: 18, fontWeight: '900' },
  userChip: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  userChipText: { color: '#e2e8f0', fontSize: 11, fontWeight: '700' },
  content: { flex: 1, backgroundColor: '#f8fafc' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingVertical: 8, paddingBottom: 16 },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 18 },
  navLabel: { fontSize: 10, color: '#64748b', fontWeight: '700', marginTop: 2 },
  navLabelActive: { color: '#059669' },
  tabContent: { flex: 1, padding: 20 },
  tabHeader: { fontSize: 20, fontWeight: '900', color: '#0f172a', marginBottom: 16 },
  bookingCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 18, marginBottom: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  bookingHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  bookingRef: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  statusCompleted: { fontSize: 10, fontWeight: '800', color: '#2563eb', backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusConfirmed: { fontSize: 10, fontWeight: '800', color: '#059669', backgroundColor: '#ecfdf5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  bookingTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  bookingMeta: { fontSize: 12, color: '#059669', fontWeight: '600', marginTop: 2 },
  bookingDates: { fontSize: 11, color: '#64748b', marginTop: 4 },
  bookingPrice: { fontSize: 16, fontWeight: '900', color: '#0f172a', marginTop: 8 },
  profileCard: { backgroundColor: '#ffffff', padding: 20, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#d1fae5', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { fontSize: 24, fontWeight: '900', color: '#065f46' },
  profileName: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  profileEmail: { fontSize: 12, color: '#64748b', marginTop: 2 },
  verifiedTag: { backgroundColor: '#ecfdf5', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, marginTop: 10 },
  verifiedTagText: { color: '#059669', fontSize: 11, fontWeight: '800' },
  settingsGroup: { marginTop: 24, padding: 16, backgroundColor: '#ffffff', borderRadius: 18, borderWidth: 1, borderColor: '#e2e8f0' },
  settingsLabel: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  settingsSub: { fontSize: 12, color: '#64748b', marginTop: 4, lineHeight: 18 },
  modalContainer: { flex: 1, backgroundColor: '#ffffff' },
  modalImage: { width: '100%', height: 260 },
  modalCloseButton: { position: 'absolute', top: 20, right: 20, backgroundColor: 'rgba(15, 23, 42, 0.7)', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  modalCloseText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  modalContent: { padding: 20 },
  modalBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalBadge: { color: '#059669', fontSize: 11, fontWeight: '800' },
  modalRating: { color: '#d97706', fontSize: 12, fontWeight: '800' },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#0f172a', lineHeight: 26 },
  modalOperator: { fontSize: 13, color: '#64748b', fontWeight: '600', marginTop: 4 },
  modalPrice: { fontSize: 18, fontWeight: '900', color: '#059669', marginTop: 8 },
  sectionHeading: { fontSize: 15, fontWeight: '800', color: '#0f172a', marginTop: 18, marginBottom: 6 },
  modalDesc: { fontSize: 13, color: '#475569', lineHeight: 20 },
  bookNowButton: { backgroundColor: '#059669', paddingVertical: 14, borderRadius: 16, alignItems: 'center', marginTop: 24 },
  bookNowText: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', padding: 20 },
  sheetCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 20 },
  sheetTitle: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  sheetSub: { fontSize: 12, color: '#64748b', marginTop: 2, marginBottom: 14 },
  inputLabel: { fontSize: 11, fontWeight: '700', color: '#334155', marginBottom: 4 },
  sheetInput: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, marginBottom: 12 },
  sheetActionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  sheetCancelBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: '#f1f5f9' },
  sheetCancelText: { color: '#475569', fontSize: 12, fontWeight: '700' },
  sheetSubmitBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12, backgroundColor: '#059669' },
  sheetSubmitText: { color: '#ffffff', fontSize: 12, fontWeight: '700' }
});
