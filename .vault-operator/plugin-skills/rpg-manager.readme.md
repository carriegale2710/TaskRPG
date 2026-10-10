# Role Playing Game Manager

[![it](https://img.shields.io/badge/lang-it-green.svg)](https://github.com/Jackson98Tomphson/rpgm-4-1-13/blob/507a08bb5b6f690f635c7d54ba1604a67d048d66/README.it.md)

RPG Manager is an Obsidian plugin to simplify the creation and running of role playing game campaings. The plugin is system-agnostic, which means you can use it if you are running a D&D, Call of Chtulhu or any other TTRPG.

## Table of Contents

- [Role Playing Game Manager](#role-playing-game-manager)
  - [Table of Contents](#table-of-contents)
  - [1. Introduction](#1-introduction)
    - [1.1. Overview of the Plugin](#11-overview-of-the-plugin)
    - [1.2. Key Features](#12-key-features)
    - [1.3. Target Audience (Plotters, Sandboxers, Lazy GMs)](#13-target-audience-plotters-sandboxers-lazy-gms)
    - [1.4. Getting Started](#14-getting-started)
    - [1.5. Upgrade your vault from v3](#15-upgrade-your-vault-from-v3)
  - [2. Installation](#2-installation)
    - [2.1. Setting up your first Campaign](#21-setting-up-your-first-campaign)
    - [2.2. User Interface](#22-user-interface)
  - [3. Overview of Elements](#3-overview-of-elements)
    - [3.1. Creating and Editing Elements](#31-creating-and-editing-elements)
    - [3.2 Relationships](#32-relationships)
    - [3.3 Elements](#33-elements)
      - [3.3.1. Campaign](#331-campaign)
      - [3.3.2. Adventures](#332-adventures)
      - [3.3.3. Chapters](#333-chapters)
      - [3.3.4. Events](#334-events)
      - [3.3.5. Locations](#335-locations)
      - [3.3.6. Clues](#336-clues)
      - [3.3.7. Non-player characters](#337-non-player-characters)
      - [3.3.8. Factions](#338-factions)
      - [3.3.9. Objects](#339-objects)
      - [3.3.10. Monsters](#3310-monsters)
      - [3.3.11. Subplots](#3311-subplots)
      - [3.3.12. Player characters](#3312-player-characters)
      - [3.3.13. Sessions](#3313-sessions)
      - [3.3.14. Scenes](#3314-scenes)
    - [3.4. Custom Attributes](#34-custom-attributes)
    - [3.5. Tasks](#35-tasks)
    - [3.6. Element Templates](#36-element-templates)
    - [3.7. Global Assets](#37-global-assets)
  - [4. Creating a World](#4-creating-a-world)
    - [4.1. What Type of Storyteller Are You?](#41-what-type-of-storyteller-are-you)
    - [4.2. For Every Storyteller You Are](#42-for-every-storyteller-you-are)
      - [4.2.1. Creating Rounded Non-Player Characters](#421-creating-rounded-non-player-characters)
      - [4.2.2. Developing Adventures and Chapters](#422-developing-adventures-and-chapters)
    - [4.3. For Plotters](#43-for-plotters)
      - [4.3.1. Using the Story Circle](#431-using-the-story-circle)
    - [4.4. For Sandboxers](#44-for-sandboxers)
      - [4.4.1. Creating Open Worlds](#441-creating-open-worlds)
      - [4.4.2. Developing Events, Locations, and Clues](#442-developing-events-locations-and-clues)
  - [5. Running a Campaign](#5-running-a-campaign)
    - [5.1. Prepping for a Session](#51-prepping-for-a-session)
    - [5.2. Taking Notes during Sessions](#52-taking-notes-during-sessions)
    - [5.3. Managing Scenes](#53-managing-scenes)
  - [6. ChatGPT Integration](#6-chatgpt-integration)
    - [6.1. Privacy Concerns](#61-privacy-concerns)
    - [6.2. Costs Implications](#62-costs-implications)
    - [6.3. Non-player characters generation](#63-non-player-characters-generation)
    - [6.4. How to activate ChatGPT](#64-how-to-activate-chatgpt)
    - [6.5. Alternatives to ChatGPT](#65-alternatives-to-chatgpt)
  - [7. Contributing](#7-contributing)
    - [7.1. Code Contributions](#71-code-contributions)
    - [7.2. Bug Reporting](#72-bug-reporting)
    - [7.3. Documentation:](#73-documentation)
    - [7.4. Other Ways to Help:](#74-other-ways-to-help)
    - [7.5. Community](#75-community)
  - [8. Frequently Asked Questions](#8-frequently-asked-questions)

## 1. Introduction

Welcome to RPG Manager, the Obsidian plugin designed to be the ultimate sidekick for Storytellers and Game Masters (GMs) preparing and running their campaigns. Are you tired of having your campaign notes scattered across multiple platforms and notebooks? RPG Manager was born out of the need for a central repository for all those brilliant ideas, notes, plotlines, and player character decisions that make up the tapestry of your game.

**Why RPG Manager?** The beauty of RPG Manager lies in its simplicity and flexibility. It allows you to easily create relationships between various elements of your campaign, forming a web of information that aids in both the plotting and running of the game. Additionally, it is a system-agnostic tool, which means it can be used with any Tabletop Role-Playing Game (TTRPG) system, providing a versatile platform for managing campaigns without being tied to a specific rule set. However, this does mean that it may not cover every single detail of every system out there, so approach RPG Manager with an open mind and a spirit of adventure!

**Advantages of RPG Manager** include centralized information, relationships between elements, system-agnostic design, and overall efficiency in preparing campaigns. By providing a central location for all your ideas, notes, and information, and allowing you to create a web of relationships between various campaign elements, RPG Manager helps you craft compelling narratives while keeping track of all the essential details.

So, embark on your storytelling journey with RPG Manager as your trusted companion. Embrace the possibilities it offers, and let it help you create unforgettable adventures.

### 1.1. Overview of the Plugin

RPG Manager is a plugin for Obsidian, designed to sit comfortably on top of it, like a well-worn wizard's hat. It associates metadata with the Obsidian notes and provides a user-friendly interface to navigate through the information. This is not just any metadata; it's the kind that helps manage the relationships between notes, a crucial aspect for any Storyteller/GM trying to weave a coherent narrative.

The **user interface** of RPG Manager is an HTML UI that organizes the metadata and displays it inside the Obsidian note. This means you don't have to flip back and forth between different applications or windows; everything you need is right there in your Obsidian note.

The **metadata** is stored inside a code block in Obsidian, rather than in the front matter. This decision was made because the front matter does not handle the amount of information needed in a clean way and takes away a lot of space at the top of the note in Obsidian. However, you don't have to worry about the nitty-gritty details of formatting or syntax, as all the metadata are read and written through the UI. This means less time wrestling with code and more time crafting your epic tales.

### 1.2. Key Features

RPG Manager boasts a range of features designed to make your storytelling journey as smooth as a bard's charm. Here's a quick rundown of what you can expect:

1. **Centralized Information**: Gather all your campaign ideas, notes, and information in one place, ensuring nothing gets lost in the chaos of creation.
2. **User-Friendly Interface**: An HTML UI embedded within your Obsidian notes to help you navigate and manage metadata without the need to juggle multiple applications or windows.
3. **Metadata Management**: Store and manage the relationships between notes with metadata, crucial for weaving a coherent narrative. The metadata is stored inside a code block in Obsidian, minimizing clutter and maximizing efficiency.
4. **Relationships Between Notes/Elements**: Manage the relationships between various campaign elements effortlessly, creating a web of information that aids in both plotting and running of the game.
5. **System-Agnostic Design**: Designed to work with any TTRPG system, providing a versatile platform for managing campaigns without being tied to a specific rule set.
6. **Elements**: Everything in RPG Manager is an "Element", whether it is a campaign, adventure, chapter, event, location, clue, non-player character, faction, object, monster, subplot, player character, session, or scene. This helps in organizing and structuring your campaign in a more coherent and logical manner.

Remember, this is just a taste of what RPG Manager has to offer. As you dive deeper into this documentation, you'll discover how each feature can be tailored to suit your unique storytelling style.

### 1.3. Target Audience (Plotters, Sandboxers, Lazy GMs)

RPG Manager is designed to be a versatile tool that can adapt to different storytelling styles. Whether you are a Plotter, Sandboxed, or a Lazy GM, this plugin has something for you.

1. **Plotters**: For those who like to meticulously plan their stories, RPG Manager offers a structured approach to organize and manage each element of your campaign, from the overarching narrative down to individual scenes and clues.
2. **Sandboxers**: If you prefer creating open worlds and letting your players roam freely, RPG Manager helps in organizing events, locations, and clues, thus aiding in creating a coherent background for your player characters to interact with.
3. **Lazy GMs**: Even if you don't prep much and prefer to jot down a few notes and bullet points before each session, RPG Manager can help in centralizing your ideas and notes, ensuring that you can quickly find what you need during the game.

Tips for All GMs

- Different GMs will use the plugin in different ways, using each element type's attributes or simply skipping them. Take some time to understand how each element and feature works and decide if it suits your style.
- While RPG Manager offers a structured approach, it is designed to be flexible and adaptable. Don't be afraid to use it in a way that works best for you, even if that means not using certain features.
- Remember, the goal of RPG Manager is to make your life as a Storyteller/GM easier and more organized, not to impose a rigid structure on your creative process.

### 1.4. Getting Started

Embarking on a new adventure with RPG Manager is as exciting as rolling a natural 20! To get started, all you need is an open mind and a willingness to explore the plugin's features to see how they align with your storytelling style.

- **Step 1: Create a Campaign**: The Campaign is the main container for all other elements in RPG Manager. Each Obsidian Vault can contain multiple campaigns, but each element (adventures, chapters, events, etc.) is available to one campaign only. So, start by creating a new campaign.
- **Open Mind Approach**: As you begin to explore the plugin, keep an open mind. Try out different features, see how the elements interact with each other, and determine if RPG Manager suits your GM style. It's essential to understand that while RPG Manager offers a structured and organized approach, it is flexible enough to adapt to different styles.

Common Pitfalls

- **One-size-fits-all Mentality**: RPG Manager is designed to be flexible and adaptable. Don't assume that you must use every feature or element. Use what works for you and your campaign.
- **Overwhelmed by Choices**: There are many elements and features available in RPG Manager. Don't feel pressured to understand or use everything right away. Take your time, explore at your own pace, and gradually incorporate the features that suit your needs.

**Resources**

While there are no tutorials or guides available at the moment, we are working on creating video tutorials to help you get the most out of RPG Manager. Stay tuned!

### 1.5. Upgrade your vault from v3

If you are already using RPG Manager and you update it to version 4, the plugin will not work. You have two options: use BRAT to revert to v3.4.5 or upgrade your vault.

Upgrading your vault is always a complicated matter, as the way you structured your data can be different from the way other storytellers have. For this reason, before upgrading your vault, **create a backup copy of it**!

**Important**: if the upgrade process gets stuck, check the Inspector Console for errors, and look for help either on [Discord](https://discord.com/channels/686053708261228577/1022806716343144518) or on [Github](https://github.com/carlonicora/obsidian-rpg-manager/issues).

## 2. Installation

Installing RPG Manager is as easy as slaying a level 1 goblin! Follow the steps below to get started:

- **Already Installed**: If you are reading this documentation from inside Obsidian, congratulations! You have already installed the RPG Manager plugin, and you are ready to embark on your storytelling journey.
- **Installation Steps**: If you haven't installed the plugin yet, follow these simple steps:
  - Open Obsidian settings.
  - Navigate to "Community Plugins".
  - Turn off "Restricted Mode" if needed.
  - Search for the "RPG Manager" plugin.
  - Once found, click "Install" and then "Activate".

And voila! You are now ready to dive into the world of RPG Manager. There is no initial setup required, so you can start creating campaigns right away!

### 2.1. Setting up your first Campaign

Creating your first campaign with RPG Manager is a piece of cake! Here are two ways to do it:

- **Command Palette**:
  - Open the command palette by pressing **Ctrl + P** (Windows) or **Cmd + P** (Mac).
  - Search for RPG Manager: create new Campaign.
  - Select the command from the list.
- **Side Panel**:
  - Click on the d20 icon on the left sidebar.
  - In the right panel, click "Create New... Campaign".

Once you create the campaign, the note containing the campaign will automatically open. That's it! You have successfully created your first campaign. Now, let the adventure begin!

### 2.2. User Interface

The User Interface (UI) of RPG Manager is designed to be intuitive and user-friendly. It is shown directly in the Obsidian note and helps users add/edit any details and see all the relevant information, attributes, and relationships of the elements.

**Main Note**: In the main note, you will find all the editable attributes of an element. The type of an element is shown underneath its name.

**Option Panel**: On the right-hand side, the option panel provides additional functionalities. The option panel can be opened by clicking on the d20 icon on the left hand-side of Obsidian, or by clicking the "Options" link in the UI. The functionalities include:

- Adding New Attributes: You can add new attributes to an element.
- Creating Relationships: Establish relationships with other elements.
- Additional Functionalities: Depending on the element type, there might be other functionalities such as Gallery Management or the creation wizard.

**Visual Indications**: The UI uses the colors of the installed theme in Obsidian. Currently, the UI is not customizable, but it will adapt to the colors of your chosen theme.

## 3. Overview of Elements

In RPG Manager, everything is considered as an "Element." An element is a fundamental building block that represents various components of your RPG campaign, such as campaigns, adventures, characters, locations, events, etc. There are different types of elements, each serving a specific purpose and having its own set of attributes and functionalities.

All elements share some common properties:

- **Description**: A text field where you can describe the element in detail.
- **Gallery**: A section where you can add a collection of images related to the element.
- **Relationships**: Links that connect an element to other elements in your campaign.

Some elements have a **hierarchical structure**. This means that they can contain child elements, and these children can be positioned in a specific order. For instance, a 'Campaign' can contain multiple 'Adventures' and 'Sessions,' and these can be organized in a particular sequence. Similarly, an 'Adventure' can contain multiple 'Chapters,' and a 'Session' can contain multiple 'Scenes.'

Understanding the concept of elements is fundamental to using RPG Manager effectively. As you get more familiar with the different types of elements and how they relate to each other, you will be able to create, edit, and manage your campaigns with ease and efficiency.

### 3.1. Creating and Editing Elements

Creating and editing elements in RPG Manager is a breeze. Whether you are adding a new character, item, or event, the process is straightforward and intuitive.

Creating New Elements:

To create a new element, you can use either the command palette or the side panel.

- **Command Palette**:
  - Open the command palette by pressing **Ctrl + P** (Windows) or **Cmd + P** (Mac).
  - Search for RPG Manager: create new ..., replacing the ellipsis with the type of element you wish to create (e.g., Adventure, Event, Location, etc.).
  - Select the command from the list.
- **Side Panel**:
  - Click on the d20 icon on the left sidebar.
  - In the right panel, click Create New... followed by the type of element you wish to create.

Remember, every element type, apart from a campaign, should belong to a campaign.

To edit the information of existing element, simply navigate to the element in the Obsidian note and follow the User Interface (UI) to make the necessary changes. The UI is designed to be user-friendly and intuitive, making it easy to edit the attributes and relationships of each element.

Now that you know how to create and edit elements, you are well on your way to becoming an RPG Manager pro!

### 3.2 Relationships

In RPG Manager, every element can contain links to other elements. These links become **relationships** between elements, forming the backbone of how information is linked to one another, which is crucial in building a campaign. Relationships can contain a description to better explain the connection between elements.

Relationships can be of different types:

- **Bidirectional**: This occurs when the relationship between A and B is visible and relevant for both A and B.
- **Unidirectional**: A relationship of this type is visible and important only in the element that defines it. If A is unidirectionally related to B, B will not see the same relationship. This is often needed to specify relationships between non-player characters.
- **Parent**: Defines a relationship in which one of the elements is the parent of another. For example, Location A can contain Location B; in this case, the relationship has a parent type.
- **Child**: The opposite of a Parent relationship.

By establishing relationships between elements, the storyteller can create a complex web of interconnected information that can be easily navigated and understood, facilitating the development and management of the campaign.

### 3.3 Elements

#### 3.3.1. Campaign

The campaign is the cornerstone of RPG Manager, the main element a storyteller can create, and all its other elements will form the central repository of information for it.

**Attributes**

- **Description**: A text field where you can describe the overall theme, setting, and plot of your campaign. This is the only required attribute.
- **Story Circle**: A space to develop your campaign's narrative using the story circle method. This is optional and particularly useful for plotters.
- **Child Adventures**: A list of adventures that are part of the campaign. These are automatically created when you create one or more adventures.
- **Child Sessions**: A list of sessions that are part of the campaign. These are automatically created when you create one or more sessions.

**Notes**:

- Campaigns are always standalone and cannot be linked or associated with other campaigns.
- The campaign does not show all the relationships to other elements, as they are children and not relationships.

In the next sections, we will delve deeper into other elements and how they relate to and support the campaign.

#### 3.3.2. Adventures

An adventure serves as a coherent narrative unit within a campaign, encompassing a series of events or challenges that have a distinct beginning and conclusion. Each adventure comprises multiple chapters, which help in structuring the narra

...[truncated]