import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, SectionList, RefreshControl, ActivityIndicator, Platform } from 'react-native';
import { BookText, PencilLine, Search, Hash } from 'lucide-react-native'; 
import axios from 'axios';
import { API_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

const StudentDashboard = ({ navigation, route }) => {
  const [workData, setWorkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const activeFilter = route.params?.filterType || 'homework';

  // --- 1. GROUPING BY DATE ---
  const sections = useMemo(() => {
    const groups = workData.reduce((acc, item) => {
      const date = new Date(item.createdAt).toLocaleDateString('en-US', {
        weekday: 'long', day: 'numeric', month: 'long',
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});

    return Object.keys(groups).map((date) => ({
      title: date,
      data: groups[date],
    }));
  }, [workData]);

  const fetchWork = useCallback(async (pageNum = 1, isRefreshing = false) => {
    try {
      let token = Platform.OS === 'web' ? localStorage.getItem('userToken') : await SecureStore.getItemAsync('userToken');
      const response = await axios.get(`${API_URL}/all-work`, {
        params: { page: pageNum, limit: 12, type: activeFilter.toLowerCase() },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newData = response.data.work;
      setWorkData(prev => (isRefreshing ? newData : [...prev, ...newData]));
      setHasMore(pageNum < response.data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error("Fetch Error:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    setLoading(true);
    fetchWork(1, true);
  }, [activeFilter]);

  const renderSectionHeader = ({ section: { title } }) => (
    <View className="bg-slate-50 py-3 px-8">
      <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-[3px]">
        {title}
      </Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View className="bg-white mx-6 mb-5 rounded-3xl shadow-sm border border-slate-100 flex-row overflow-hidden">
      {/* Subject Accent Bar */}
      <View className={`w-2 ${activeFilter === 'homework' ? 'bg-blue-600' : 'bg-orange-500'}`} />
      
      <View className="flex-1 p-5">
        {/* Subject Name */}
        <View className="flex-row items-center mb-3">
          <Hash size={14} color={activeFilter === 'homework' ? "#2563eb" : "#ea580c"} />
          <Text className="ml-2 text-slate-900 font-black text-lg">
            {item.title} 
          </Text>
        </View>

        {/* Details Box */}
        <View className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <Text className="text-slate-600 text-sm leading-6">
            {item.description || "No specific instructions provided."}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white pt-16 pb-8 px-8 rounded-b-[40px] shadow-sm">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Academy Portal</Text>
            <Text className="text-4xl font-black text-slate-900">
              {activeFilter === 'homework' ? 'Homework' : 'Classwork'}
            </Text>
          </View>
          <View className={`p-4 rounded-2xl ${activeFilter === 'homework' ? 'bg-blue-50' : 'bg-orange-50'}`}>
            {activeFilter === 'homework' ? <BookText color="#2563eb" size={28} /> : <PencilLine color="#ea580c" size={28} />}
          </View>
        </View>
      </View>

      {/* Agenda List */}
      {loading && page === 1 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 120 }}
          onEndReached={() => hasMore && fetchWork(page + 1)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchWork(1, true)} />}
          ListEmptyComponent={
            <View className="items-center mt-32 px-10">
              <Search size={48} color="#cbd5e1" />
              <Text className="text-slate-400 mt-4 text-center font-bold">No {activeFilter} for today.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default StudentDashboard;