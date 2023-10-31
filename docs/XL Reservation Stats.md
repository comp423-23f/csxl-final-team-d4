# Design Document

## 0 Title & Team:

XL Reservation Stats: Qingyuan Fan, Pan Lu, Somer Lillard, Yutong Wu.

## 1 Overview:

As an ambassador I will be able to see the xl lab's reservation statistics in order to better understand the lab's demand usage. An ambassador will also be able to have access to visualizations of the statistics data and access to reports of common queries for convenience. As a student I will be able to see my personal statistics in order to efficiently utilize my time in the lab.

## 2 Key Personas:

This feature serves for the Sally Student to view individual coworking statistics history. This would better visualize their performance and their need of the coworking environment. The statistics help individual students understand their situations and improve their performances in coworking environment.

## 3 User Stories organized by persona, necessity for a minimum-viable feature, and frequency/importance of use.

As Sally Student, I want to be able to visually see the specific time frame I spent in csxl lab and the total number of days I stayed in csxl lab, so I can understand my overall performance.

## 4 Wireframes / Mockups:

See docs/images/studentStat-wireframe.png

## 5 Technical Implementation Opportunities and Planning

## What specific areas of the existing code base will you directly depend upon, extend, or integrate with?

I will majorly use codes from checkin histories and users, so that for each student user, I will have the checkin histories and the date and time of each student shown so I would be able to generalize it into one graph and make visualizations.

## 1. What planned page components and widgets, per the assigned reading, do you anticipate needing in your feature’s frontend?

One widget to use is the date search bar and the onyen search bar because for all the pages, we want to be able to use the date search bar to navigate among different users and different dates.

## 2. What additional models, or changes to existing models, do you foresee needing (if any)?

The current model is enough because we are getting the data from the current model and make visualizations toward it. There might be a new model called weeks to be able to store the data for each time stamp.

## 3. Considering your most-frequently used and critical user stories, what API / Routes do you foresee modifying or needing to add?

Add stats/{student} for individual student onyens and stats/{date} for specific date for individual routes.

## 4. What concerns exist for security and privacy of data? Should the capabilities you are implementing be specific to only certaain users or roles? (For example: When Sally Student makes a reservation, only Sally Student or Amy Ambassador should be able to cancel the reservation. Another student, such as Sam Student, should not be able to cancel Sally’s reservation.)

Each students' data should only be present to this student with the correct pid. However, if for Amy Ambassador, they should be able to view all students' histories and navigate among them.
