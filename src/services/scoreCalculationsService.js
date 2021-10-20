export function calculateStatus(perfect, great, good, boo, miss) {
    if (boo+miss !== 0) {
        return 'Cleared';
    } else if (good !== 0) {
        return 'GoFC';
    } else if (great !== 0) {
        return 'GFC';
    } else if (perfect !== 0) {
        return 'PFC';
    }
    return 'MFC';
}

export function calculateGrade(score) {
    const scoreCutoffs = [990000, 950000, 900000, 890000, 850000, 800000, 790000, 750000, 700000, 690000, 650000, 600000, 590000, 550000, 0];
    const grades = ['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D'];
    for (let i = 0; i < scoreCutoffs.length; i++) {
        if (score >= scoreCutoffs[i]) {
            return grades[i];
        }
    }
}

export function calculateScore(stepScore, marvellous, perfect, great, good, ok) {
    return Math.floor((stepScore*(marvellous+ok) + (stepScore-10)*(perfect) + ((stepScore*(0.6))-10)*great + ((stepScore*(0.2))-10)*good) / 10) * 10;
}

export const blankScore = {
    marvellous: 0,
    perfect: 0,
    great: 0,
    good: 0,
    boo: 0,
    miss: 0,
    ok: 0,
    combo: 0,
    score: 0,
    grade: 'E',
    status: 'Unplayed',
};