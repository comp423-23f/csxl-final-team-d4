# Design Document

## 0 Title & Team:

XL Reservation Stats: Qingyuan Fan, Pan Lu, Somer Lillard, Yutong Wu.

## 1 Overview:

As an ambassador I will be able to see the xl lab's reservation statistics in order to better understand the lab's demand usage. An ambassador will also be able to have access to visualizations of the statistics data and access to reports of common queries for convenience. As a student I will be able to see my personal statistics in order to efficiently utilize my time in the lab.

Story 1:

## 2 Key Personas: This feature mainly serves the Amy XL Ambassador or the Rhonda Root. It can present them the graph of statistics regarding to recent usage. Therefore they are able to manipulate the data and have a great view of how the data are distributed and come up with a better plan with letting people use XL.

## 3 For this story, the amabassador should be able to have an extra button on the side bar and clicking it direct them to a search page where people can select parameters and after click the search, a graph should be displayed. Amabassadors should be able to view it at any time and for each search, it should retrieve the latest data from the database and display. How to implement the graph display is not yet clear. Also, for future work on saving searches, more adaptions on this part should be made.

## 4 Wireframes / Mockups: see /image

## 5 
  ## 1 For isolation, I am assuming my input is a table of data, with ids as row and for each column an seperate feature is located (checkin_time, check_out_time, etc), my initial thought on this would be to first set up different methods in backend for searches with different input values, 
  
  ## 2 For frontend, having a calendar that allows clicking that sends quries to backend. 
  
  ## 3 Also, we will probably use some javascript dynamic loading feature to make the graph shown. This is a seperate feature involving the database and frontend so new API routes should be created. 
  
  ## 4 To ensure the security of the data, one of the crucial thing is that only the amabassador should be able to see the data so special token authentication should be envolved as well.

Story2:
## 2 Key Personas:

The feature serves the Amy XL Ambassador or the Rhonda Root. The Amy XL Ambassador or the Rhonda Root needs to be able to save the parameters of common queries called “Reports” that can be opened without having to specify the parameters again.

## 3

Users, such as Amy XL Ambassador or Rhonda Root, can perform complex queries and analyses to extract specific data from the reservation statistics. These queries might involve selecting particular date ranges, comparing usage over different time periods, or applying certain filters and metrics. Those queries can be saved into "Reports" for quick access and reuse without specifying parameters again.

## 4

Wireframes / Mockups: Include rough wireframes of your feature’s user interfaces for the most critical user stories, along with brief descriptions of what is going on. These can be hand-drawn, made in PowerPoint/KeyNote, or created with a tool like Figma. To see an example of a detailed wireframe Kris made this summer before building the drop-in feature, see this Figma board. You will notice the final implementation is not 1:1 with the original wireframe!

## 5
  ## 1 Technical Implementation Opportunities and Planning I want to utilize existing backend logic for fetching reservation data from the database.
  
  ## 2 On the page exclusively for XL Ambassador, we would need another widget named "Statistics". By clicking this button, user will be redirected to another page displaying coworking statistics. On the statistics page, there will be a widget used to save the parameters of common queries as long as user clicks it. And those parameters of common queries will all be stored in a drop-down menu. 
  
  ## 3 A new model may be needed to store saved reports with user associations and query parameters. Two API routes may be needed. GET /api/reservation_stats: Fetch reservation statistics based on selected parameters. POST /api/save_report: Save user-generated reports with specified parameters.
  
  ## 4 Besides, we need to make sure only Amy XL Ambassador or Rhonda Root has the access to all the coworking statistics.

Story3:
## 2 Key Personas: As Amy Ambassador or Rhonda Root I want to be to make reports of common queries and associated visualizations publicly available for students and other ambassadors alike. The need for this is easy public access to xl lab usage statistics and the goal is being able to share these statistics with others to better understand how to improve xl lab use.

## 3 For this story, the amabassador should have a button for sharing a recent report (common query) and associated visualization for easy public access at a later point. There should also be an associated "Statistics" page where a user can see all saved public queries. The frequency/importance of this feature will be somewhat high considering this is a public feature that will likely be accessed by multiple ambassadors and students at a time.

## 4 Wireframes / Mockups: Drawing located in docs/images

## 5
  ## 1. I will extend upon the functionality of saving reports and add the capability of sharing each saved query to a public statistics page.

  ## 2. I anticipate needing new widgets for easy sharing capability for each saved report.

  ## 3. I possibly anticipate needing new models for the public "Statistics" page version of the XL amabassador stats page. I think there will need to be a route to connect the proposed "save" widget to a new component page named "Statistics."

  ## 4. The only security/privacy concern for this data is ensuring both students and ambassadors have equal access to the "Statistics" page.



Story 4:
## 2 Key Personas:

This feature serves for the Sally Student to view individual coworking statistics history. This would better visualize their performance and their need of the coworking environment. The statistics help individual students understand their situations and improve their performances in coworking environment.

## 3 
As Sally Student, I want to be able to visually see the specific time frame I spent in csxl lab and the total number of days I stayed in csxl lab, so I can understand my overall performance.

## 4 Wireframes / Mockups:

See docs/images/studentStat-wireframe.png

## 5 
  I will majorly use codes from checkin histories and users, so that for each student user, I will have the checkin histories and the date and time of each student shown so I would be able to generalize it into one graph and make visualizations.

  ## 1. What planned page components and widgets, per the assigned reading, do you anticipate needing in your feature’s frontend?

  One widget to use is the date search bar and the onyen search bar because for all the pages, we want to be able to use the date search bar to navigate among different users and different dates.

  ## 2. What additional models, or changes to existing models, do you foresee needing (if any)?

  The current model is enough because we are getting the data from the current model and make visualizations toward it. There might be a new model called weeks to be able to store the data for each time stamp.

  ## 3. Considering your most-frequently used and critical user stories, what API / Routes do you foresee modifying or needing to add?

  Add stats/{student} for individual student onyens and stats/{date} for specific date for individual routes.

  ## 4. What concerns exist for security and privacy of data? Should the capabilities you are implementing be specific to only certaain users or roles? (For example: When Sally Student makes a reservation, only Sally Student or Amy Ambassador should be able to cancel the reservation. Another student, such as Sam Student, should not be able to cancel Sally’s reservation.)

  Each students' data should only be present to this student with the correct pid. However, if for Amy Ambassador, they should be able to view all students' histories and navigate among them.
