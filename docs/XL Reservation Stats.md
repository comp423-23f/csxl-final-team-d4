# Design Document

## 0 Title & Team: XL Reservation Stats: Qingyuan Fan, Pan Lu, Somer Lillard, Yutong Wu.

## 1 Overview: As an ambassador I will be able to see the xl lab's reservation statistics in order to better understand the lab's demand usage. An ambassador will also be able to have access to visualizations of the statistics data and access to reports of common queries for convenience. As a student I will be able to see my personal statistics in order to efficiently utilize my time in the lab.

## 2 Key Personas: As Amy Ambassador or Rhonda Root I want to be to make reports of common queries and associated visualizations publicly available for students and other ambassadors alike. The need for this is easy public access to xl lab usage statistics and the goal is being able to share these statistics with others to better understand how to improve xl lab use.

## 3 For this story, the amabassador should have a button for sharing a recent report (common query) and associated visualization for easy public access at a later point. There should also be an associated "Statistics" page where a user can see all saved public queries. The frequency/importance of this feature will be somewhat high considering this is a public feature that will likely be accessed by multiple ambassadors and students at a time.

## 4 Wireframes / Mockups: Drawing located in docs/images

## 5 Technical Implementation Opportunities and Planning

## 1. I will extend upon the functionality of saving reports and add the capability of sharing each saved query to a public statistics page.

## 2. I anticipate needing new widgets for easy sharing capability for each saved report.

## 3. I do not anticipate needing additional models for this story.

## 4. I think there will need to be a route to connect the proposed "save" widget to a new component page named "Statistics."

## 5. The only security/privacy concern for this data is ensuring both students and ambassadors have equal access to the "Statistics" page.
