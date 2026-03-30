<script lang="ts">
	import Modal from './Modal.svelte';

	import * as z from 'zod';
	import Select from './import/Select.svelte';
	import Selected from './import/Selected.svelte';
	import { getDate, getTranslations } from '$lib/utils';
	import { fetchVerse } from '$lib/bible/chapterServices';

	let { showImportModal = $bindable() } = $props();

	let validFile = $state(true);
	let importedSet: object | null = $state(null); // the VerseSet type will be specified later, once behaviour for file processing is implemented
	let fileInput: HTMLInputElement | null = $state(null);
	let selectedFile: File | null | undefined = $state(null);

	/**
	 * Ensures a JSON object contains a valid name and an array of verses,
	 * each with a valid orderId, translation, and verseReference.
	 *
	 * @param json - The object to validate.
	 * @returns `true` if the object matches the VerseSet schema, `false` otherwise.
	 */
	function validateJSON(json: object) {
		const Verse = z.object({
			orderId: z.number(),
			translation: z.enum(getTranslations() as [string, ...string[]]),
			verseReference: z.string()
		});

		const VerseSet = z.object({
			verses: z.array(Verse),
			name: z.string().transform((name) => name.slice(0, 30)) // the name must be sliced so that the ui doesn't break
		});

		const result = VerseSet.safeParse(json);

		return result.success;
	}

	type UploadedVerse = {
		orderId: string;
		translation: string;
		verseReference: string;
	};

	let uploadError = $state('');

	/**
	 * Fetches the text for each verse in the provided array and attaches it to the verse object.
	 * If any verse reference is invalid (i.e. the verse doesn't exist in the specified translation), the function returns `null`.
	 *
	 * @param verses - The array of verses to fetch
	 * @param verseSetId - The UUID of the verse set these verses belong to.
	 * @returns A promise resolving to an array of verses with their fetched text attached,
	 * or `null` if any verse reference was invalid.
	 */
	async function getVerses(verses: UploadedVerse[], verseSetId: string) {
		const versePromises = verses.map(async (verse) => {
			const result = await fetchVerse(verse.verseReference, verse.translation.toUpperCase());

			if (!result) {
				uploadError =
					'This file contains one or more verse references that could not be found. They may be invalid or unavailable in the selected translation.';

				return {};
			}

			return {
				...verse,
				verseSetId,
				text: result.text
			};
		});

		const resolvedVerses = await Promise.all(versePromises);

		let invalidVerseReference = false;

		resolvedVerses.forEach((verse) => {
			if (!('text' in verse)) {
				invalidVerseReference = true;
			}
		});

		return invalidVerseReference ? null : resolvedVerses;
	}

	/**
	 * Reads and processes the currently selected file into a VerseSet object.
	 * Parses the file as JSON, validates its structure, and fetches the text for each verse.
	 *
	 * @returns A promise resolving to a VerseSet object if the file is valid, or `null` if:
	 * - The file is corrupted or cannot be parsed as JSON.
	 * - The JSON does not match the VerseSet schema.
	 * - Any verse reference is invalid.
	 */
	async function readFile() {
		type ImportedSet = {
			name: string;
			verses: UploadedVerse[];
		};

		let content: ImportedSet | null = null;

		try {
			content = await JSON.parse(await selectedFile!.text());
		} catch {
			uploadError =
				"This file doesn't appear to be a valid verse set. It may be corrupted or exported from an incompatible version.";

			return null;
		}

		const jsonValid = validateJSON(content as object);

		if (!jsonValid) {
			uploadError =
				"This file doesn't appear to be a valid verse set. It may be corrupted or exported from an incompatible version.";

			return null;
		}

		const verseSetId = crypto.randomUUID();
		const verses = await getVerses(content!.verses, verseSetId);

		if (!verses) return null;

		return {
			id: verseSetId,
			name: content?.name,
			lastEdited: getDate(),

			verses
		};
	}

	let isReady = $state(false);

	/**
	 * Handles file upload from both drag-and-drop and file input events.
	 * Sets the selected file, processes it via `readFile`, and updates the import state.
	 *
	 * @param e - The event triggered by a file input change or a drag-and-drop drop event.
	 */
	async function handleUpload(e: Event) {
		e.preventDefault(); // prevents a new tab from opening

		isReady = false;
		validFile = true;

		if (e instanceof DragEvent) {
			const file = e.dataTransfer?.files?.[0];

			selectedFile = file;
		} else {
			const file = fileInput?.files?.item(0);

			selectedFile = file;
		}

		const result = await readFile();

		if (!result) {
			validFile = false;
			selectedFile = null;

			fileInput!.value = '';
		} else {
			isReady = true;
			importedSet = result;
		}
	}
</script>

<Modal modalTitle="Import Verse Set" bind:showModal={showImportModal}>
	{#if !isReady || !validFile || !importedSet}
		<Select {handleUpload} bind:selectedFile bind:fileInput bind:validFile bind:uploadError />
	{:else}
		<Selected bind:importedSet bind:selectedFile bind:showImportModal />
	{/if}
</Modal>
