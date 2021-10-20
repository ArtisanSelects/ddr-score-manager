import React from "react";

export default function About() {

    const infoCard = (title, displayText, imageSrc, cardLeft) => {
        const imgContainer = () => {
            return (
                <div className="about-infocard-img-container">
                    {imageSrc.map(img => <img key={img} className="about-infocard-img" alt={`Visual example for ${title}`} src={`/images/${img}.jpg`} />)}
                </div>
            )
        }
        
        return (
            <div key={title} className="about-infocard" id={title}>
                <h2 className="about-infocard-heading">{title}</h2>
                <div className="about-infocard-content">
                    {cardLeft && (
                        imgContainer()
                    )}
                    {displayText}
                    {!cardLeft && (
                        imgContainer()
                    )}
                </div>
            </div>
        );
    }

    const explanationTable = (headers, dataArray) => {
        return (
            <table className="about-infocard-table">
                <thead>
                    <tr>
                        {headers.map(header => <th key={header}>{header}</th>)}
                    </tr>
                </thead>
                <tbody>
                {dataArray.map(row => {
                    return (
                        <tr key={row}>
                            {row.map(info => <td key={info}>{info}</td>)}
                        </tr>
                    )
                })}
                </tbody>
            </table>
        )
    }

    const cards = [
        {
            title: "SONGS AND CHARTS",
            displayText: <div className="about-infocard-paragraph"><p>In DDR terms, a CHART is the sequence of arrows that players must step on, while a SONG refers to both a piece of music as well as a collection of charts that are synchronized to said music. Songs generally have four to five charts, separated into Beginner, Basic, Difficult, Expert, and Challenge difficulties.</p></div>,
            imageSrc: ["chart"],
        },
        {
            title: "PLAY MODES (SINGLE AND DOUBLE PLAY)",
            displayText: <div className="about-infocard-paragraph"><p>SINGLE PLAY charts use four arrows, while DOUBLE PLAY charts use eight. Since I only have one dance pad, and since LIFE4 is only for Single Play charts, this website doesn't track Double Play charts.</p></div>,
            imageSrc: ["singles", "doubles"],
        },
        {
            title: "DIFFICULTY RATINGS",
            displayText: <div className="about-infocard-paragraph"><p>Every chart is assigned a DIFFICULTY RATING ranging from 1 to 19, with 1 being the easiest and 19 being the hardest.</p></div>,
            imageSrc: ["difficulty_ratings"],
        },
        {
            title: "DIFFICULTY RANKINGS",
            displayText: <div className="about-infocard-paragraph"><p>Even though two charts may share the same difficulty rating, that doesn't mean they're equally difficult. For example, the expert charts for "In the past" and "Neutrino" are both 16s, but the former is considered a "low 16" while the latter is a "high 16." DIFFICULTY RANKINGS attempt to further organize charts within their respective difficulty ratings based on how difficult they are to score on. These rankings are unofficial, and come from <a href="https://ddrcommunity.com/ddr-a20-plus-scoring-difficulty-ranking-list/">DDRCommunity's Scoring Difficulty Ranking List</a>.</p></div>,
            imageSrc: ["difficulty_rankings"],
        },
        {
            title: "NOTE TYPES",
            displayText: <div className="about-infocard-paragraph"><p>DDR charts contain three types of notes: REGULAR, FREEZE, and SHOCK.</p><p>REGULAR arrows need only be stepped on. They can appear as single notes or together in pairs, otherwise known as jumps. While some custom charts and other dancing games such as In the Groove or Pump it Up also make use of three or more sets of arrows, DDR charts don't feature any.</p><p>A FREEZE note is a regular note that, after being stepped on, must continued to be held down. If properly held, players receive an OK judgment; otherwise, they receive a Miss.</p><p>SHOCK notes are a rare type of note that only appear in a limited number of charts. Almost like a reverse freeze note, if any arrow is held down as these notes pass the receptor then the player is penalized with a miss. However, successfully avoiding a shock arrow grants an OK judgment and adds one to the combo count.</p></div>,
            imageSrc: ["notetypes_normal", "notetypes_freeze", "notetypes_shock"],
        },
        {
            title: "NOTE JUDGMENTS",
            displayText: <div className="about-infocard-paragraph"><p>Every time a player steps on an arrow/note, they receive a JUDGMENT RATING depending on how accurate they were. From most to least accurate, they are as follows: Marvellous, Perfect, Great, Good, Boo, and Miss. Furthermore, a properly-held freeze note and properly-avoided shock arrow will give an OK judgment.</p><p>NOTE: While the arcade version doesn't have the Boo judgment, the program I'm using at home (Stepmania) does. For the sake of score calculation, Boo judgments are treated as Misses.</p></div>,
            imageSrc: ["note_judgments"],
        },
        {
            title: "TIMING WINDOWS",
            displayText: <div className="about-infocard-paragraph"><p>A TIMING WINDOW is the length of time that the player has to hit a note as it crosses the receptors. As an example, a Marvellous timing window of 16 milliseconds means that the player must hit the note either 16ms before or 16ms after the note crosses the receptor in order to receive a Marvellous judgment.</p><p>By default, Stepmania's judgment windows are more forgiving than the arcade version of DDR's. Since the official DDR timing windows have never been publically released, the settings I use on my home setup are the ones that are generally accepted by the DDR community as being the most arcade-accurate as possible.</p></div>,
            imageSrc: ["timing_windows"],
        },
        {
            title: "COMBO SYSTEM",
            displayText: <div className="about-infocard-paragraph"><p>If the player receives a judgment of Good or better or manages to avoid a shock arrow, their COMBO COUNT is increased by 1. A boo, miss, unheld freeze note, or unavoided shock arrow resets the combo to 0. Also, despite being made up of two notes, jumps only increase the combo by 1.</p></div>,
            imageSrc: ["combo"],
        },
        {
            title: "PASSING AND FAILING",
            displayText: <div className="about-infocard-paragraph"><p>Under normal circumstances, players must perform well enough during gameplay to keep their LIFEBAR filled. Proper steps will increase it, while misses will decrease it. If the lifebar drops beneath a certain point then players will FAIL the song. There are also special lifebars, such as the "LIFE 4" option which replaces the bar with a battery containing four cells. Every combo breaker permanently decreases the cell count by one, with four combo breakers resulting in failure. "Sudden Death" is the same as LIFE 4 but with only one cell instead of four.</p></div>,
            imageSrc: ["lifebar_normal", "lifebar_life4"],
        },
        {
            title: "SCORING SYSTEM",
            displayText: <div className="about-infocard-paragraph"><p>After playing a chart, players are given a SCORE depending on well they performed. The game calculates the score by taking the maximum possible score of 1,000,000 and dividing it by the total number of notes in the song. This value is refered to as the "step score." A perfect step (or Marvellous) adds the full step score amount to the player's score, while anything less awards fewer points (e.g., a Perfect gives the step score minus 10, and a miss gives 0). The final result is then rounded to the nearest 10. For the complete formula, please see <a href="https://remywiki.com/DanceDanceRevolution_SuperNOVA2_Scoring_System">this page on RemyWiki</a>.</p></div>,
            imageSrc: ["scoring_system"],
        },
        {
            title: "SCORE GRADES",
            displayText: <div className="about-infocard-paragraph"><p>In addition to a numerical score, players also receive a LETTER GRADE based on how high their score is. They are as follows:</p>
            {explanationTable(['Score', 'Grade'], [['990,000 - 1,000,000', 'AAA'],['950,000 - 989,990', 'AA+'],['900,000 - 949,990', 'AA'],['890,000 - 899,990', 'AA-'],['850,000 - 889,990', 'A+'],['800,000 - 849,990', 'A'],['790,000 - 799,990', 'A-'],['750,000 - 789,990', 'B+'],['700,000 - 749,990', 'B'],['690,000 - 699,990', 'B-'], ['650,000 - 689,990', 'C+'],['600,000 - 649,990', 'C'],['590,000 - 599,990', 'C-'],['550,000 - 589,990', 'D+'], ['0 - 549,990', 'D'], ['Failed', 'E']])}
            </div>,
            imageSrc: ["score_grades"],
        },
        {
            title: "SCORE STATUSES",
            displayText: <div className="about-infocard-paragraph"><p>Scores are also assigned a STATUS based on whether they meet a particular set of criteria. They are as follows:</p>
            {explanationTable(['Status', 'Description'], [['MFC - Marvellous Full Combo', 'A perfect score consisting of only Marvellous judgments.'],['PFC - Perfect Full Combo', 'A score consisting of only Perfect judgments and above.'],['GFC - Great Full Combo', 'A score consisting of only Great judgments and above.'],['GoFC - Good Full Combo', 'A score consisting of only Good judgments and above.'],['Cleared', 'A score not meeting any of the above criteria but was nevertheless passed.'],['Unplayed', 'A score of 0, meaning the song has yet to be attempted.']])}</div>,
            imageSrc: ["score_statuses"],
        },
        {
            title: "LAMPS",
            displayText: <div className="about-infocard-paragraph"><p>When selecting a song to play on the arcade version of DDR, it's possible to group all of the various charts by their difficulty ratings (e.g. all of the 15s, all of the 16s, etc). As you do so, a colored box will appear around each difficulty rating; this box is referred to as a LAMP, and its color reflects your overall performance for each difficulty. It is, in essence, a status that applies to a collection of charts. They are as follows:</p>
            {explanationTable(['Lamp Color', 'Description'],[['Dark Gray/None', 'There are still one or more unplayed charts.'],['Amber/Clear','Every chart with the given difficulty rating has been passed.'],['Red', 'Every chart with the given difficulty rating has been cleared under LIFE4 constraints (3 or fewer combo breakers).'],['Blue', 'Every chart with the given difficulty rating has been cleared with a GoFC or above.'],['Green', 'Every chart with the given difficulty rating has been cleared with a GFC or above.'],['Gold', 'Every chart with the given difficulty rating has been cleared with a PFC or above.'],['White', 'Every chart with the given difficulty rating has been cleared with an MFC or above.']] )}</div>,
            imageSrc: ["lamps"],
        },
    ];

    return (
        <div className="about-container">
            <div className="about-this-site">
                <h1 className="about-infocard-heading text-center">About</h1>
                <p>Originally released in 1998, Dance Dance Revolution (or DDR for short) is a rhythm game where players step on arrows set in time to music. As arrows travel across the screen towards a receptor area, players stand on a dance pad consisting of up, down, left, and right arrows and try to time their steps as accurately as possible. Each step is awarded a judgment ranging from Marvellous to Miss, and at the end of the song an overall score is given.</p>

                <p>I created this website because, being someone who plays at home rather than in the arcade, I'm unable to use the offical Dance Dance Revolution score tracker. I try to follow the <a href="https://life4ddr.com/">LIFE4</a> ranking requirements, which seek to gauge a player's skill level according to their scores. For the most part, these rankings are only concerned with official DDR songs with a difficulty rating of 14 and above, so those are the scores I've chosen to track. Any other songs, such as those with difficulty ratings of 13 and below or those which don't appear in the arcade releases, can be found in the Miscellaneous Scores section.</p>
            </div>
            <div className="about-table-of-contents">
                <h2 className="about-table-of-contents-header text-center">Explanations</h2>
                <ul>
                    {cards.map(card => {
                        return (
                            <li key={card.title}><a href={`#${card.title}`}>{card.title}</a></li>
                        );
                    })}
                </ul>
            </div>
            {cards.map((card, i) => {
                return infoCard(card.title, card.displayText, card.imageSrc, i%2===1);
            })}
            <div onClick={() => window.scrollTo(0,0)} className="about-container-return-to-top"><span>↑</span></div>
        </div>
    );
}