import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '../api';

// (타입 정의와 WordCard 컴포넌트는 이전과 동일합니다)
interface Meaning {
    meaning: string;
}
interface WordData {
    wordId: number;
    sentenceId: number;
    word: string;
    meanings: Meaning[];
}
interface ProcessedWord extends WordData {
    formattedMeanings: string;
    isMeaningVisible: boolean;
}
const WordCard = ({ item, onItemToggle }: { item: ProcessedWord; onItemToggle: (id: string) => void }) => {
    const uniqueId = `${item.wordId}-${item.sentenceId}`;
    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <TouchableOpacity
                    style={[
                        styles.meaningToggle,
                        { backgroundColor: item.isMeaningVisible ? '#DDF8F0' : '#D9D9D9' },
                    ]}
                    onPress={() => onItemToggle(uniqueId)}
                />
                <Text style={styles.wordText}>{item.word}</Text>
                {item.isMeaningVisible && (
                    <Text style={styles.meaningText} numberOfLines={1}>
                        {item.formattedMeanings}
                    </Text>
                )}
            </View>
        </View>
    );
};


// 홈 화면 메인 컴포넌트
export default function HomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [words, setWords] = useState<ProcessedWord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAllMeanings, setShowAllMeanings] = useState(false);

    const fetchWords = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/api/word');
            const processedData = response.data.data.map((word: WordData) => ({
                ...word,
                formattedMeanings: word.meanings
                    .map((m, index) => `${index + 1}. ${m.meaning}`)
                    .join(' '),
                isMeaningVisible: false,
            }));
            setWords(processedData);
        } catch (error) {
            console.error("단어 목록을 불러오는데 실패했습니다.", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWords();
    }, [fetchWords]);

    const handleToggleAllMeanings = () => {
        const newShowAllState = !showAllMeanings;
        setShowAllMeanings(newShowAllState);
        setWords(prevWords =>
            prevWords.map(word => ({
                ...word,
                isMeaningVisible: newShowAllState,
            }))
        );
    };

    const handleItemToggle = (uniqueId: string) => {
        setWords(prevWords =>
            prevWords.map(word =>
                `${word.wordId}-${word.sentenceId}` === uniqueId
                    ? { ...word, isMeaningVisible: !word.isMeaningVisible }
                    : word
            )
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#000000" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            {/* --- 헤더 --- */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.toggleAllButton} onPress={handleToggleAllMeanings}>
                    <View style={[styles.checkbox, { backgroundColor: showAllMeanings ? '#000' : '#FFF' }]} />
                    <Text>의미 보기</Text>
                </TouchableOpacity>

                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={() => router.push('/mypage')}>
                        <Ionicons name="person-circle-outline" size={32} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={fetchWords} style={{ marginTop: 8 }}>
                        <Ionicons name="refresh-outline" size={30} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* --- 단어 목록 --- */}
            <FlatList
                data={words}
                renderItem={({ item }) => <WordCard item={item} onItemToggle={handleItemToggle} />}
                keyExtractor={(item) => `${item.wordId}-${item.sentenceId}`}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
}

// --- 스타일시트 ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end', // <-- 이 부분을 'center'에서 'flex-end'로 수정했습니다.
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    toggleAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000',
        marginRight: 8,
    },
    headerIcons: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    listContainer: {
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: '#F7F7F7',
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    meaningToggle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 16,
    },
    wordText: {
        fontSize: 18,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    meaningText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 'auto',
        paddingLeft: 10,
        flexShrink: 1,
    },
});