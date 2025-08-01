
export type FeedbackData = {
    angle: number;
    threshold: number;
    active: boolean;
}

export function generateFeedbackSequence(length: number): FeedbackData[] {
    const arr: FeedbackData[] = [];

    const maxDeviation = 15;

    for (let i = 0; i < length; i++) {
        const prevAngle = arr[i - 1]?.angle ?? -90;

        arr.push({
            angle: Phaser.Math.Angle.WrapDegrees(
                prevAngle + 180 + Phaser.Math.Between(-(maxDeviation / 2), maxDeviation / 2)
            ),
            threshold: 30,
            active: false,
        });
    }

    return arr;
}

