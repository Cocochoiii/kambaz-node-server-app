// The shape of the Pazza sample data.
// Every course gets the same thirteen slots.
// So the glance numbers look the same in every course.
//
// Nine questions and four notes.
// Six questions have an answer and three are still open.
// Three posts carry a followup discussion and two of those carry a reply.
// One post is private to the instructors.
// I pin two notes.
//
// The day counts matter. Day 0 fills Today and day 1 fills Yesterday.
// Day 7 always lands in the Last Week group.
// That holds on any weekday I demo on.
// The rest fall into week range groups.

export const SLOTS = [
    { days: 0, hour: 9, by: "student", type: "question", folders: ["hw2"], answers: ["faculty"], followups: [{ resolved: true, by: "student" }] },
    { days: 0, hour: 11, by: "student", type: "question", folders: ["project"], answers: [] },
    { days: 0, hour: 14, by: "faculty", type: "note", folders: ["office_hours"], answers: [] },

    { days: 1, hour: 9, by: "student", type: "question", folders: ["hw1"], answers: ["faculty"], followups: [{ resolved: false, by: "student", reply: "faculty" }] },
    { days: 1, hour: 12, by: "faculty", type: "note", folders: ["logistics"], answers: [] },
    { days: 1, hour: 16, by: "student", type: "question", folders: ["exam"], answers: [] },

    { days: 7, hour: 10, by: "student", type: "question", folders: ["hw3"], answers: ["student", "faculty"], followups: [{ resolved: true, by: "student", reply: "student" }] },
    { days: 7, hour: 15, by: "student", type: "question", folders: ["logistics"], answers: ["faculty"], private: true },

    { days: 14, hour: 10, by: "student", type: "question", folders: ["other"], answers: ["student"] },
    { days: 16, hour: 11, by: "faculty", type: "note", folders: ["exam"], answers: [], pinned: true },
    { days: 21, hour: 10, by: "student", type: "question", folders: ["hw1"], answers: ["faculty"] },
    { days: 25, hour: 13, by: "student", type: "question", folders: ["project"], answers: [] },
    { days: 28, hour: 9, by: "faculty", type: "note", folders: ["logistics"], answers: [], pinned: true },
];

// A post older than this counts as already read by a few classmates.
// So the unread number on the glance screen is never zero.
export const READ_AFTER_DAYS = 14;
