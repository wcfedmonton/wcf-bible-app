# WCF Bible App

> A Bible verse lookup and presentation tool for speakers at Winners Campus Fellowship Edmonton.

## Live Demo

[Live App](https://bible.wcfedmonton.ca/)

## Overview

The WCF Bible App is a SvelteKit web application built for Winners Campus Fellowship Edmonton to help speakers look up, organize, and display Bible verses during teachings. Users can search for scripture passages and build named verse sets for presentation use. The app is secured behind AWS Cognito authentication so that only authorized team members can manage verse sets.

## Features

- Bible verse search and lookup powered by `YouVersion Platform`, `API.Bible` and `Bible Passage Reference Parser`
- Create, manage, and save named verse sets
- Reordering of verse entries within a set
- Keyboard navigation — arrow keys bound to navigation actions
- Secure authentication via AWS Cognito

### Coming Soon

- Verse set delivery via email

## Tech Stack

| Layer          | Technology                                         |
|----------------|----------------------------------------------------|
| Framework      | SvelteKit 2 (Svelte 5)                             |
| Language       | TypeScript 5                                       |
| Styling        | Tailwind CSS 4                                     |
| Authentication | AWS Cognito |
| Bible Data     | YouVersion Platform Core, API.Bible, BibleSDK, Bible Passage Reference Parser |
| Database       | AWS DynamoDB                                       |
| Deployment     | AWS Amplify                                        |
| Forms          | Felte + Zod                                        |
| Build Tool     | Vite 7                                             |
