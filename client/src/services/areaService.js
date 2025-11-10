// src/services/areaService.js
// Mocked for Step 1. We'll replace with real API calls later.

const MOCK = {
  'cs-block': { events: 2, usersOnline: 14 },
  'mechanical-workshop': { events: 0, usersOnline: 6 },
  'library': { events: 1, usersOnline: 22 },
  'sports-complex': { events: 1, usersOnline: 18 },
  'cricket-field': { events: 0, usersOnline: 7 },
  'food-court': { events: 3, usersOnline: 30 },
  'main-entrance': { events: 0, usersOnline: 5 },
  'polytechnic-gate': { events: 0, usersOnline: 2 },
  'tsls-gate': { events: 0, usersOnline: 1 },
  'hostels-zone': { events: 1, usersOnline: 40 },
};

export async function getAreaStatus(areaId) {
  // simulate network latency
  await new Promise(r => setTimeout(r, 150));
  return MOCK[areaId] || { events: 0, usersOnline: 0 };
}
