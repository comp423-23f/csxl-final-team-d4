# Design Document

## 0 Title & Team: XL Reservation Stats: Qingyuan Fan, Pan Lu, Somer Lillard, Yutong Wu.

## 1 Overview: As an ambassador I will be able to see the xl lab's reservation statistics in order to better understand the lab's demand usage. An ambassador will also be able to have access to visualizations of the statistics data and access to reports of common queries for convenience. As a student I will be able to see my personal statistics in order to efficiently utilize my time in the lab.

## 2 Key Personas: This feature mainly serves the Amy XL Ambassador or the Rhonda Root. It can present them the graph of statistics regarding to recent usage. Therefore they are able to manipulate the data and have a great view of how the data are distributed and come up with a better plan with letting people use XL.

## 3 For this story, the amabassador should be able to have an extra button on the side bar and clicking it direct them to a search page where people can select parameters and after click the search, a graph should be displayed. Amabassadors should be able to view it at any time and for each search, it should retrieve the latest data from the database and display. How to implement the graph display is not yet clear. Also, for future work on saving searches, more adaptions on this part should be made.

## 4 Wireframes / Mockups: see /image

## 5 For isolation, I am assuming my input is a table of data, with ids as row and for each column an seperate feature is located (checkin_time, check_out_time, etc), my initial thought on this would be to first set up different methods in backend for searches with different input values,

and for frontend, having a calendar that allows clicking that sends quries to backend. Also, we will probably use some javascript dynamic loading feature to make the graph shown. This is a seperate feature involving the database and frontend so new API routes should be created. To ensure the security of the data, one of the crucial thing is that only the amabassador should be able to see the data so special token authentication should be envolved as well.
