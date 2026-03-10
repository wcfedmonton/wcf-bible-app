export async function load() {
	const data = [
		// server will send the verses sorted by their orderid for their initial load, client handles re-sorting on changes
		{
			id: 'v001', // a reference to the database id
			verses: [
				{
					orderId: 1,
					verseSetId: 'v001',
					translation: 'NIV',
					verseReference: 'John 3:16',
					text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.'
				},
				{
					orderId: 2,
					verseSetId: 'v001',
					translation: 'NIV',
					verseReference: 'Psalm 23:1',
					text: 'The Lord is my shepherd, I lack nothing.'
				},
				{
					orderId: 3,
					verseSetId: 'v001',
					translation: 'NIV',
					verseReference: 'Romans 8:28',
					text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.'
				},
				{
					orderId: 4,
					verseSetId: 'v001',
					translation: 'NIV',
					verseReference: 'Philippians 4:13',
					text: 'I can do all this through him who gives me strength.'
				},
				{
					orderId: 5,
					verseSetId: 'v001',
					translation: 'NIV',
					verseReference: 'Jeremiah 29:11',
					text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.'
				},
				{
					orderId: 6,
					verseSetId: 'v001',
					translation: 'NIV',
					verseReference: 'Isaiah 40:31',
					text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.'
				},
				{
					orderId: 7,
					verseSetId: 'v001',
					translation: 'NIV',
					verseReference: 'Proverbs 3:5-6',
					text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.'
				},
				{
					orderId: 8,
					verseSetId: 'v001',
					translation: 'NIV',
					verseReference: 'Matthew 5:9',
					text: 'Blessed are the peacemakers, for they will be called children of God.'
				},
				{
					orderId: 9,
					verseSetId: 'v001',
					translation: 'NIV',
					verseReference: 'Psalm 46:1',
					text: 'God is our refuge and strength, an ever-present help in trouble.'
				},
				{
					orderId: 10,
					verseSetId: 'v001',
					translation: 'NIV',
					verseReference: 'Romans 12:12',
					text: 'Be joyful in hope, patient in affliction, faithful in prayer.'

					// NOTE: any call to update or delete should automatically edit the lastEdited field of the parent verse set (updated on the client, then we call update() for the parent verse set)
					// update() will send a request to change the verses ordering
					// delete() will send a request to delete the verse from the set
				}
			],
			lastEdited: 'Mar 7, 2026',
			name: 'New Verse Set'

			// NOTE: any call to update or delete should automatically edit the lastEdited field
			// update()  will send a request after an update (changing the name of the set). it will accept
			// the id of the verse to delete, and then the action that should be done (add or remove)
			// delete() will send a request to delete the verse set
		}
	];

	return { data };
}
