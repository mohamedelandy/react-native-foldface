import { StyleSheet, Text } from "react-native";
import { theme } from "../../theme";

export const starString = (rating: number): string => {
  const full = Math.max(0, Math.min(5, Math.floor(rating)));
  return "★".repeat(full) + "☆".repeat(5 - full);
};

type RatingStarsProps = {
  rating: number;
  size?: number;
  testID?: string;
};

export function RatingStars({ rating, size = 13, testID }: RatingStarsProps) {
  return (
    <Text testID={testID} style={[styles.stars, { fontSize: size }]}>
      {starString(rating)}
    </Text>
  );
}

const styles = StyleSheet.create({
  stars: {
    color: theme.colors.star,
  },
});
