
export type FeedbackData = {
    angle: number;
    threshold: number;
    active: boolean;
}

export function generatemFeedback(): FeedbackData {
    return {
        angle: Phaser.Math.Angle.RandomDegrees(),
        threshold: 45,
        active: false,
    };
}

export function generateFeedbackSequence(length: number): FeedbackData[] {
    const arr = [];

    for (let i = 0; i < length; i++) {
        arr.push(generatemFeedback());
    }

    return arr;
}

