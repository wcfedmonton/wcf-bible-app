export async function load() {
	/*
		verses: [{
				verseSetId: "abc",
				translation: "NIV", // translation is kept seperate from reference for integration with the home page 
				verseReference: "John 14:27",
				text: "Peace I leave with you; my peace I give you."
			}],
	*/
	const data = [
		{
			id: 'abc', // a reference to the database id
			verses: [
  {
    verseSetId: "v001",
    translation: "NIV",
    verseReference: "John 3:16",
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
  },
  {
    verseSetId: "v002",
    translation: "NIV",
    verseReference: "Psalm 23:1",
    text: "The Lord is my shepherd, I lack nothing."
  },
  {
    verseSetId: "v003",
    translation: "NIV",
    verseReference: "Romans 8:28",
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose."
  },
  {
    verseSetId: "v004",
    translation: "NIV",
    verseReference: "Philippians 4:13",
    text: "I can do all this through him who gives me strength."
  },
  {
    verseSetId: "v005",
    translation: "NIV",
    verseReference: "Jeremiah 29:11",
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future."
  },
  {
    verseSetId: "v006",
    translation: "NIV",
    verseReference: "Isaiah 40:31",
    text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint."
  },
  {
    verseSetId: "v007",
    translation: "NIV",
    verseReference: "Proverbs 3:5-6",
    text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight."
  },
  {
    verseSetId: "v008",
    translation: "NIV",
    verseReference: "Matthew 5:9",
    text: "Blessed are the peacemakers, for they will be called children of God."
  },
  {
    verseSetId: "v009",
    translation: "NIV",
    verseReference: "Psalm 46:1",
    text: "God is our refuge and strength, an ever-present help in trouble."
  },
  {
    verseSetId: "v010",
    translation: "NIV",
    verseReference: "Romans 12:12",
    text: "Be joyful in hope, patient in affliction, faithful in prayer."
  }
],
			lastEdited: 'Mar 7, 2026',
			name: 'New Verse Set'

			// update()  will send a request after an update (adding/removing a verse from the set). it will accept
			// the id of the verse to delete, and then the action that should be done (add or remove)
			// delete() will send a request to delete the verse set
		}
	];

	return { data };
}
