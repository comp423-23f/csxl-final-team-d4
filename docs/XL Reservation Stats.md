# Design Document

## 0 Title & Team:

XL Reservation Stats: Qingyuan Fan, Pan Lu, Somer Lillard, Yutong Wu.

## 1 Overview:

As an ambassador I will be able to see the xl lab's reservation statistics in order to better understand the lab's demand usage. An ambassador will also be able to have access to visualizations of the statistics data and access to reports of common queries for convenience. As a student I will be able to see my personal statistics in order to efficiently utilize my time in the lab.

## 2 Key Personas:

The feature serves the Amy XL Ambassador or the Rhonda Root. The Amy XL Ambassador or the Rhonda Root need to be able to save the parameters of common queries called “Reports” that can be opened without having to specify the parameters again.

## 3

Users, such as Amy XL Ambassador or Rhonda Root, can perform complex queries and analyses to extract specific data from the reservation statistics. These queries might involve selecting particular date ranges, comparing usage over different time periods, or applying certain filters and metrics. Those queries can be saved into "Reports" for quick access and reuse without specifying parameters again.

## 4

Wireframes / Mockups: Include rough wireframes of your feature’s user interfaces for the most critical user stories, along with brief descriptions of what is going on. These can be hand-drawn, made in PowerPoint/KeyNote, or created with a tool like Figma. To see an example of a detailed wireframe Kris made this summer before building the drop-in feature, see this Figma board. You will notice the final implementation is not 1:1 with the original wireframe!

## 5

Technical Implementation Opportunities and Planning I want to utilize existing backend logic for fetching reservation data from the database. On the page exclusively for XL Ambassador, we would need another widget named "Statistics". By clicking this button, user will be redirected to another page displaying coworking statistics. On the statistics page, there will be a widget used to save the parameters of common queries as long as user clicks it. And those parameters of common queries will all be stored in a drop-down menu. A new model may be needed to store saved reports with user associations and query parameters. Two API routes may be needed. GET /api/reservation_stats: Fetch reservation statistics based on selected parameters. POST /api/save_report: Save user-generated reports with specified parameters. Besides, we need to make sure only Amy XL Ambassador or Rhonda Root has the access to all the coworking statistics.
