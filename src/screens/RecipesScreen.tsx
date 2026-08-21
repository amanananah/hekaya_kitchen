import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { RecipeArtwork } from '../components/RecipeArtwork';
import { TopBar } from '../components/TopBar';
import { recipes } from '../data';
import { colors, radii } from '../theme';
import type { Recipe, RecipeCategory } from '../types';

type RecipesScreenProps = {
  onOpenRecipe: (recipeId: string) => void;
};

type Filter = 'All' | RecipeCategory;

const filters: Filter[] = ['All', 'Mains', 'Bread', 'Sweets', 'Breakfast'];

export function RecipesScreen({ onOpenRecipe }: RecipesScreenProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  const visibleRecipes = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return recipes.filter((recipe) => {
      const matchesFilter = filter === 'All' || recipe.category === filter;
      const matchesQuery = !normalized || [recipe.name, recipe.arabicName, recipe.keeper, recipe.category]
        .some((value) => value.toLocaleLowerCase().includes(normalized));
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  const totalStories = recipes.reduce((total, recipe) => total + recipe.storyCount, 0);
  const totalCheckpoints = recipes.reduce((total, recipe) => total + recipe.checkpointCount, 0);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      style={styles.screen}
    >
      <TopBar />
      <Text style={styles.eyebrow}>THE FAMILY VAULT</Text>
      <Text style={styles.title}>Every recipe holds a person, a place and a way of knowing.</Text>

      <View style={styles.statsCard}>
        <Stat value={recipes.length.toString()} label="living recipes" />
        <View style={styles.statDivider} />
        <Stat value={totalStories.toString()} label="family stories" />
        <View style={styles.statDivider} />
        <Stat value={totalCheckpoints.toString()} label="visual cues" />
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          accessibilityLabel="Search family recipes"
          onChangeText={setQuery}
          placeholder="Search a dish or family member"
          placeholderTextColor="#98A098"
          returnKeyType="search"
          style={styles.searchInput}
          value={query}
        />
        {query ? (
          <Pressable accessibilityLabel="Clear search" onPress={() => setQuery('')} style={styles.clearButton}>
            <Text style={styles.clearText}>×</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.filters} horizontal showsHorizontalScrollIndicator={false}>
        {filters.map((item) => {
          const selected = filter === item;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected }}
              key={item}
              onPress={() => setFilter(item)}
              style={[styles.filter, selected && styles.filterSelected]}
            >
              <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{item}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.listHeading}>
        <View>
          <Text style={styles.listTitle}>{query || filter !== 'All' ? 'Matching memories' : 'Preserved recipes'}</Text>
          <Text style={styles.listSubtitle}>{visibleRecipes.length} {visibleRecipes.length === 1 ? 'recipe' : 'recipes'} in this view</Text>
        </View>
        <View style={styles.voiceBadge}><Text style={styles.voiceBadgeText}>Original voices kept</Text></View>
      </View>

      <View style={styles.recipeList}>
        {visibleRecipes.map((recipe) => (
          <RecipeRow key={recipe.id} onPress={() => onOpenRecipe(recipe.id)} recipe={recipe} />
        ))}
      </View>

      {!visibleRecipes.length ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptySymbol}>✦</Text>
          <Text style={styles.emptyTitle}>No family memory matches yet</Text>
          <Text style={styles.emptyCopy}>Try another word or choose All to see the complete archive.</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

function RecipeRow({ recipe, onPress }: { recipe: Recipe; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.recipeCard, pressed && styles.pressed]}>
      <View style={styles.artWrap}>
        <RecipeArtwork compact recipe={recipe} />
        <View style={styles.categoryBadge}><Text style={styles.categoryText}>{recipe.category}</Text></View>
      </View>
      <View style={styles.recipeBody}>
        <Text numberOfLines={1} style={styles.recipeTitle}>{recipe.name}</Text>
        <Text numberOfLines={1} style={styles.recipeArabic}>{recipe.arabicName}</Text>
        <Text numberOfLines={2} style={styles.recipeSummary}>{recipe.summary}</Text>
        <View style={styles.recipeMeta}>
          <Text style={styles.keeper}>{recipe.keeper}</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>
    </Pressable>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 34 },
  eyebrow: { color: colors.clay, fontSize: 10, fontWeight: '800', letterSpacing: 1.6 },
  title: { maxWidth: 360, marginTop: 9, color: colors.forestDeep, fontFamily: 'serif', fontSize: 34, lineHeight: 38, letterSpacing: -0.9 },
  statsCard: { marginTop: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', borderRadius: 21, backgroundColor: colors.forest },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: colors.paper, fontFamily: 'serif', fontSize: 23, fontWeight: '700' },
  statLabel: { marginTop: 3, color: 'rgba(255,250,242,0.68)', fontSize: 9 },
  statDivider: { width: StyleSheet.hairlineWidth, height: 34, backgroundColor: 'rgba(255,255,255,0.22)' },
  searchBox: { minHeight: 54, marginTop: 18, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, borderRadius: 17, backgroundColor: colors.paper },
  searchIcon: { width: 28, color: colors.forest, fontSize: 25 },
  searchInput: { flex: 1, height: 52, color: colors.forestDeep, fontSize: 13 },
  clearButton: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: colors.sagePale },
  clearText: { marginTop: -2, color: colors.forest, fontSize: 22 },
  filters: { paddingVertical: 14, gap: 8 },
  filter: { paddingHorizontal: 14, paddingVertical: 9, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, borderRadius: radii.round, backgroundColor: colors.paper },
  filterSelected: { borderColor: colors.forest, backgroundColor: colors.forest },
  filterText: { color: colors.inkMuted, fontSize: 11, fontWeight: '700' },
  filterTextSelected: { color: colors.paper },
  listHeading: { marginTop: 6, marginBottom: 13, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  listTitle: { color: colors.forestDeep, fontSize: 16, fontWeight: '800' },
  listSubtitle: { marginTop: 4, color: colors.inkMuted, fontSize: 10 },
  voiceBadge: { paddingHorizontal: 9, paddingVertical: 7, borderRadius: radii.round, backgroundColor: colors.clayPale },
  voiceBadgeText: { color: colors.clay, fontSize: 9, fontWeight: '800' },
  recipeList: { gap: 12 },
  recipeCard: { minHeight: 136, flexDirection: 'row', overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, borderRadius: 22, backgroundColor: colors.paper },
  artWrap: { width: 116, minHeight: 136, overflow: 'hidden' },
  categoryBadge: { position: 'absolute', left: 8, top: 8, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, backgroundColor: 'rgba(255,250,242,0.9)' },
  categoryText: { color: colors.forest, fontSize: 8, fontWeight: '800' },
  recipeBody: { flex: 1, padding: 14 },
  recipeTitle: { color: colors.forestDeep, fontFamily: 'serif', fontSize: 20, fontWeight: '700' },
  recipeArabic: { marginTop: 1, color: colors.clay, fontSize: 13 },
  recipeSummary: { marginTop: 6, color: colors.inkMuted, fontSize: 10, lineHeight: 15 },
  recipeMeta: { marginTop: 'auto', paddingTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  keeper: { color: colors.forest, fontSize: 10, fontWeight: '800' },
  chevron: { color: colors.clay, fontSize: 24, fontWeight: '300' },
  pressed: { opacity: 0.84, transform: [{ scale: 0.99 }] },
  emptyState: { marginTop: 26, padding: 28, alignItems: 'center', borderRadius: 24, backgroundColor: colors.sagePale },
  emptySymbol: { color: colors.clay, fontSize: 24 },
  emptyTitle: { marginTop: 8, color: colors.forestDeep, fontSize: 14, fontWeight: '800' },
  emptyCopy: { maxWidth: 260, marginTop: 6, color: colors.inkMuted, fontSize: 11, lineHeight: 17, textAlign: 'center' },
});
