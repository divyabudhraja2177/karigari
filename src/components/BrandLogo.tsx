import React, { useState } from 'react';
import { View, Image, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, Path, Line } from 'react-native-svg';
import { theme } from '../theme';

interface BrandLogoProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
  withCardFrame?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 90,
  style,
  withCardFrame = false,
}) => {
  const [loadFailed, setLoadFailed] = useState(false);

  // Handcrafted vector lotus fallback
  const renderVectorLogo = () => (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ width: size, height: size }}
    >
      {/* Soft background roundel */}
      <Circle
        cx="50"
        cy="50"
        r="46"
        fill="#F6F0E7"
        stroke="#E9E1D9"
        strokeWidth="2"
      />

      {/* Outer Stitched Thread Circle (Craft Motif) */}
      <Circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="#D8A7AD"
        strokeWidth="1.8"
        strokeDasharray="4 3"
      />

      {/* Central Lotus Flower Motif (Empowerment & Heritage) */}
      {/* Left Petal */}
      <Path
        d="M50 72 C32 66 22 52 28 36 C34 44 44 54 50 72 Z"
        fill="#A8B5A0"
        opacity={0.85}
      />
      {/* Right Petal */}
      <Path
        d="M50 72 C68 66 78 52 72 36 C66 44 56 54 50 72 Z"
        fill="#A8B5A0"
        opacity={0.85}
      />
      {/* Central Petal */}
      <Path
        d="M50 20 C40 38 34 50 50 74 C66 50 60 38 50 20 Z"
        fill="#D8A7AD"
      />
      {/* Inner Golden Core */}
      <Path
        d="M50 36 C45 46 42 54 50 68 C58 54 55 46 50 36 Z"
        fill="#E9D99A"
        opacity={0.95}
      />

      {/* Thread Needle Accent Stitch */}
      <Line
        x1="28"
        y1="76"
        x2="72"
        y2="76"
        stroke="#59473F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Circle cx="50" cy="76" r="3" fill="#D8A7AD" />
    </Svg>
  );

  const content = (
    <View style={[styles.innerContainer, { width: size, height: size }]}>
      {loadFailed ? (
        renderVectorLogo()
      ) : (
        <Image
          source={require('../../assets/logo.png')}
          style={{ width: size, height: size }}
          resizeMode="contain"
          onError={() => setLoadFailed(true)}
        />
      )}
    </View>
  );

  if (withCardFrame) {
    const framePadding = Math.max(4, Math.round(size * 0.08));
    return (
      <View
        style={[
          styles.cardFrame,
          {
            padding: framePadding,
            borderRadius: Math.round(size * 0.22),
          },
          style,
        ]}
      >
        {content}
      </View>
    );
  }

  return <View style={style}>{content}</View>;
};

const styles = StyleSheet.create({
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cardFrame: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: theme.colors.cardBorder,
    shadowColor: theme.colors.deepBrown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
