export default function statisticsCalculationService(songList) {
    const initialStatuses = {MFC: 0, PFC: 0, GFC: 0, GoFC: 0, Cleared: 0, Unplayed: 0};

    const initialStat = {
        difficulty: "",
        songCount: 0,
        AAAs: 0,
        highestScore: null,
        lowestScore: null,
        lamp: "",
        redLampSongs: 0,
    }

    const statistics = {"All": {...initialStat, difficulty: "All", statuses: {...initialStatuses}},
                        "14": {...initialStat, difficulty: "14", statuses: {...initialStatuses}},
                        "15": {...initialStat, difficulty: "15", statuses: {...initialStatuses}},
                        "16": {...initialStat, difficulty: "16", statuses: {...initialStatuses}},
                        "17": {...initialStat, difficulty: "17", statuses: {...initialStatuses}},
                        "18": {...initialStat, difficulty: "18", statuses: {...initialStatuses}},
                        "19": {...initialStat, difficulty: "19", statuses: {...initialStatuses}},
                        
                    };

    function updateStats(difficulty, song) {
        let statsheet = statistics[difficulty];
        statsheet.songCount++;
        const difficultyShorthands = {
            'Beginner': 'BSP',
            'Basic': 'BSP',
            'Difficult': 'DSP',
            'Expert': 'ESP',
            'Challenge': 'CSP'
        };
        if (song.score) {
            let score = song.score;
            statsheet.statuses[score.status]++;
            if (score.status !== "Unplayed" && score.miss+score.boo+score.good < 4) {
                statsheet.redLampSongs++;
            }
            if (score.grade === 'AAA') {
                statsheet.AAAs++;
            }
            
            if (score.status !== "Unplayed") {
                if (statsheet.highestScore) {
                    if (statsheet.highestScore.score < score.score) {
                        statsheet.highestScore = {...score, title: `${song.title} (${difficultyShorthands[song.chartDifficulty]})`, songID: song._id};
                    }
                } else {
                    statsheet.highestScore = {...score, title: `${song.title} (${difficultyShorthands[song.chartDifficulty]})`, songID: song._id};
                }
    
                if (statsheet.lowestScore) {
                    if (statsheet.lowestScore.score > score.score) {
                        statsheet.lowestScore = {...score, title: `${song.title} (${difficultyShorthands[song.chartDifficulty]})`, songID: song._id};
                    }
                } else {
                    statsheet.lowestScore = {...score, title: `${song.title} (${difficultyShorthands[song.chartDifficulty]})`, songID: song._id};
                }
            }
        }    
    }

    for (let song of songList) {
        if (song.difficulty < 14 || song.difficulty > 19) {
            continue;
        }
        updateStats(song.difficulty, song);
        updateStats("All", song);
    }

    for (let diff of Object.getOwnPropertyNames(statistics)) {
        const statsheet = statistics[diff];
        const statuses = statsheet.statuses;
        const songCount = statsheet.songCount;

        if (statuses.Unplayed === 0 && songCount !== 0) {
            if (statuses.MFC === songCount) {
                statsheet.lamp = "White";
            } else if (statuses.MFC+statuses.PFC === songCount) {
                statsheet.lamp = "Gold";
            } else if (statuses.MFC+statuses.PFC+statuses.GFC === songCount) {
                statsheet.lamp = "Green";
            } else if (statuses.MFC+statuses.PFC+statuses.GFC+statuses.GoFC === songCount) {
                statsheet.lamp = "Blue";
            } else if (statsheet.redLampSongs === songCount) {
                statsheet.lamp = "Red";
            } else {
                statsheet.lamp = "Clear";
            }
        } else statsheet.lamp = "No";
    }

    return statistics;
}