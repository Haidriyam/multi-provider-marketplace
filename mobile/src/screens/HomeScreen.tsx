import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  ActivityIndicator,
  FlatList,
  SafeAreaView
} from 'react-native';
import { mobileApi } from '../services/api';

export default function HomeScreen({ navigation, onSelectListing }: any) {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [dest, cat, list] = await Promise.all([
          mobileApi.getDestinations(),
          mobileApi.getCategories(),
          mobileApi.getListings({ limit: '6' })
        ]);
        if (dest.success) setDestinations(dest.data || []);
        if (cat.success) setCategories(cat.data || []);
        if (list.success) setListings(list.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={styles.loadingText}>Loading Faraday Expeditions...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER HERO */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>VERIFIED OPERATORS</Text>
        </View>
        <Text style={styles.heroTitle}>Discover Northern & Coastal Expeditions</Text>
        <Text style={styles.heroSubtitle}>Browse verified packages with direct operator communication</Text>

        {/* SEARCH INPUT */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Hunza, Skardu, Scuba, 4x4..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* CATEGORIES PILLS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {categories.map((c) => (
            <TouchableOpacity key={c.id} style={styles.categoryCard}>
              <Text style={styles.categoryName}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* TOP DESTINATIONS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Destinations</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {destinations.map((d) => (
            <TouchableOpacity key={d.id} style={styles.destinationCard}>
              <Image source={{ uri: d.imageUrl }} style={styles.destinationImage} />
              <View style={styles.destinationOverlay} />
              <Text style={styles.destinationName}>{d.name}</Text>
              <Text style={styles.destinationRegion}>{d.region}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* FEATURED PACKAGES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Offerings</Text>
        {listings.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.listingCard}
            onPress={() => onSelectListing && onSelectListing(item)}
          >
            <Image
              source={{ uri: item.media?.[0]?.url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' }}
              style={styles.listingImage}
            />
            <View style={styles.listingContent}>
              <View style={styles.listingHeader}>
                <Text style={styles.operatorName}>🛡️ {item.provider?.businessName}</Text>
                <Text style={styles.ratingText}>★ {item.rating.toFixed(1)}</Text>
              </View>
              <Text style={styles.listingTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.listingMeta}>
                {item.destination?.name} • {item.durationDays} Days • Max {item.maxGuests} Guests
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceText}>
                  {item.currency} {item.basePrice.toLocaleString()}
                </Text>
                <View style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View Details</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 13, color: '#64748b', fontWeight: '600' },
  hero: { backgroundColor: '#0f172a', padding: 24, paddingTop: 40, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  heroBadge: { backgroundColor: 'rgba(5, 150, 105, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 12 },
  heroBadgeText: { color: '#34d399', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  heroTitle: { color: '#ffffff', fontSize: 24, fontWeight: '900', lineHeight: 30 },
  heroSubtitle: { color: '#94a3b8', fontSize: 12, marginTop: 6, marginBottom: 18 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: '#0f172a' },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  horizontalScroll: { flexDirection: 'row' },
  categoryCard: { backgroundColor: '#ffffff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, marginRight: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  categoryName: { fontSize: 12, fontWeight: '700', color: '#1e293b' },
  destinationCard: { width: 140, height: 180, borderRadius: 18, overflow: 'hidden', marginRight: 12, position: 'relative' },
  destinationImage: { width: '100%', height: '100%' },
  destinationOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 42, 0.4)' },
  destinationName: { position: 'absolute', bottom: 22, left: 10, right: 10, color: '#ffffff', fontSize: 14, fontWeight: '800' },
  destinationRegion: { position: 'absolute', bottom: 8, left: 10, color: '#a7f3d0', fontSize: 10, fontWeight: '600' },
  listingCard: { backgroundColor: '#ffffff', borderRadius: 20, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  listingImage: { width: '100%', height: 160 },
  listingContent: { padding: 14 },
  listingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  operatorName: { fontSize: 11, fontWeight: '700', color: '#059669' },
  ratingText: { fontSize: 11, fontWeight: '800', color: '#d97706' },
  listingTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a', lineHeight: 20 },
  listingMeta: { fontSize: 11, color: '#64748b', marginTop: 4 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  priceText: { fontSize: 16, fontWeight: '900', color: '#0f172a' },
  viewButton: { backgroundColor: '#059669', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  viewButtonText: { color: '#ffffff', fontSize: 11, fontWeight: '700' }
});
