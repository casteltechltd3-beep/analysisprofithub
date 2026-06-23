import { PredictionType, MarketAnalysis, PredictionInput } from "./types"

export class IntelligentPredictionEngine {
  /**
   * For OVER signals: Suggests OVER 1, OVER 2, OVER 3
   * Uses highest digit in over range (5-9) as entry point
   */
  predictOver(analysis: MarketAnalysis, lastDigit: number): PredictionInput {
    const { over1Percent, over2Percent, over3Percent, highestOverDigit } = analysis

    let prediction: PredictionType = "over"
    let confidence = Math.max(over1Percent, over2Percent, over3Percent)

    // Choose strongest over range
    if (over1Percent >= 60) {
      prediction = "over" // Over 1 (digits 2-9)
    } else if (over2Percent >= 60) {
      prediction = "over" // Over 2 (digits 3-9)
    } else if (over3Percent >= 60) {
      prediction = "over" // Over 3 (digits 4-9)
    }

    return {
      type: prediction,
      entryDigit: highestOverDigit, // Use highest digit in over range
      confidence: confidence,
      lastN: 60,
    }
  }

  /**
   * For UNDER signals: Suggests UNDER 6, UNDER 7, UNDER 8
   * Uses highest digit in under range (0-4) as entry point
   */
  predictUnder(analysis: MarketAnalysis, lastDigit: number): PredictionInput {
    const { under6Percent, under7Percent, under8Percent, highestUnderDigit } = analysis

    let prediction: PredictionType = "under"
    let confidence = Math.max(under6Percent, under7Percent, under8Percent)

    // Choose strongest under range
    if (under8Percent >= 60) {
      prediction = "under" // Under 8 (digits 0-7)
    } else if (under7Percent >= 60) {
      prediction = "under" // Under 7 (digits 0-6)
    } else if (under6Percent >= 60) {
      prediction = "under" // Under 6 (digits 0-5)
    }

    return {
      type: prediction,
      entryDigit: highestUnderDigit, // Use highest digit in under range
      confidence: confidence,
      lastN: 60,
    }
  }

  /**
   * For MATCHES signals: Wait for highest digit then trade
   */
  predictMatches(analysis: MarketAnalysis, recentDigits: number[]): PredictionInput {
    const { highestMatchesDigit } = analysis

    // Check if we should wait for the highest digit to appear
    const waitingForDigit = recentDigits[recentDigits.length - 1] !== highestMatchesDigit

    return {
      type: "matches",
      entryDigit: highestMatchesDigit,
      confidence: 60,
      lastN: 60,
    }
  }

  /**
   * For DIFFERS signals: Trade when rare digit appears
   */
  predictDiffers(analysis: MarketAnalysis, recentDigits: number[]): PredictionInput {
    const { rareDigits } = analysis

    // Get the rarest digit
    const rarest = rareDigits.length > 0 ? rareDigits[0] : 0

    return {
      type: "differs",
      entryDigit: rarest,
      confidence: 65,
      lastN: 60,
    }
  }

  /**
   * For EVEN/ODD signals: Wait for 2+ consecutive opposite digits
   * Then trade the favored one
   */
  predictEvenOdd(analysis: MarketAnalysis, recentDigits: number[]): PredictionInput {
    const { evenPercent, oddPercent, consecutiveEvens, consecutiveOdds } = analysis

    // Determine which is dominant
    const isDominantEven = evenPercent > oddPercent

    // Check for consecutive opposite digits
    if (isDominantEven) {
      // Trading EVEN - wait for 2+ consecutive ODD digits
      if (consecutiveOdds >= 2) {
        // Check if last digit is odd
        const lastDigit = recentDigits[recentDigits.length - 1]
        if (lastDigit % 2 === 1) {
          return {
            type: "even",
            entryDigit: lastDigit, // Will trade opposite
            confidence: Math.min(evenPercent, 85),
            lastN: 20,
          }
        }
      }
    } else {
      // Trading ODD - wait for 2+ consecutive EVEN digits
      if (consecutiveEvens >= 2) {
        // Check if last digit is even
        const lastDigit = recentDigits[recentDigits.length - 1]
        if (lastDigit % 2 === 0) {
          return {
            type: "odd",
            entryDigit: lastDigit, // Will trade opposite
            confidence: Math.min(oddPercent, 85),
            lastN: 20,
          }
        }
      }
    }

    // Return neutral if conditions not met
    return {
      type: isDominantEven ? "even" : "odd",
      entryDigit: -1,
      confidence: Math.max(evenPercent, oddPercent),
      lastN: 60,
    }
  }

  /**
   * Auto-change prediction based on market power
   * This runs during active trading to optimize prediction
   */
  autoAdjustPrediction(
    currentPrediction: PredictionType,
    analysis: MarketAnalysis,
    recentDigits: number[]
  ): { prediction: PredictionType; entryDigit: number; confidence: number; shouldSwitch: boolean } {
    const { over1Percent, under8Percent, highestOverDigit, highestUnderDigit } = analysis

    let shouldSwitch = false
    let newPrediction = currentPrediction
    let newEntryDigit = -1
    let newConfidence = 0

    // If trading OVER but UNDER becomes stronger
    if ((currentPrediction === "over" || currentPrediction === "rise") && under8Percent > over1Percent + 10) {
      shouldSwitch = true
      newPrediction = "under"
      newEntryDigit = highestUnderDigit
      newConfidence = under8Percent
    }

    // If trading UNDER but OVER becomes stronger
    if ((currentPrediction === "under" || currentPrediction === "fall") && over1Percent > under8Percent + 10) {
      shouldSwitch = true
      newPrediction = "over"
      newEntryDigit = highestOverDigit
      newConfidence = over1Percent
    }

    return {
      prediction: newPrediction,
      entryDigit: newEntryDigit,
      confidence: newConfidence,
      shouldSwitch: shouldSwitch,
    }
  }

  /**
   * Check if entry conditions are met for a prediction
   */
  isEntryConditionMet(
    prediction: PredictionType,
    lastDigit: number,
    entryDigit: number,
    recentDigits: number[]
  ): boolean {
    // For MATCHES: Wait until entry digit appears
    if (prediction === "matches") {
      return lastDigit === entryDigit
    }

    // For DIFFERS: Wait until any digit appears
    if (prediction === "differs") {
      return lastDigit !== entryDigit
    }

    // For OVER: Entry digit should be in over range
    if (prediction === "over") {
      return lastDigit >= 5 && lastDigit === entryDigit
    }

    // For UNDER: Entry digit should be in under range
    if (prediction === "under") {
      return lastDigit <= 4 && lastDigit === entryDigit
    }

    // For EVEN: Last digit should be even
    if (prediction === "even") {
      return lastDigit % 2 === 0
    }

    // For ODD: Last digit should be odd
    if (prediction === "odd") {
      return lastDigit % 2 === 1
    }

    return false
  }
}

export const predictionEngine = new IntelligentPredictionEngine()
