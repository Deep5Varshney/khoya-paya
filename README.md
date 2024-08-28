## Khoya - Paya portal

 - This portal serves as a platform for managing and tracking reports of missing and found children, offering a secure space for parents and authorities to provide essential information and updates.

- It makes reporting and searching easier, helping to resolve cases quickly 

## Features

Users : Parents/guardians, authorities, admin

## Parents/guardians

```javascript
  1) Easily sign in and log in to the portal with correct credentials.
  2) Easily file a missing report for their child.
  3) Provide key details like :
      child's name,
      age,
      accessories,
      physical description etc. and many other fields.
  4) Upload images of the missing child.
  5) Track the complaint status using correct information, such as : 
      FIR date,
      FIR number,
      state and district etc.
  6) Save entered details with the "Save and Continue" option.
  7) Reset all details with the "Reset" button 
        
```

## Authorities

```javascript
  1) File a found child report effortlessly.
  2) Enter crucial details like :
      child's name,
      age,
      personal information,
      details about the location and environment etc. and many other fields.
  3) Upload images of the found child.
  4) Record the contact details of the person who found the child.
  5) Save entered details with the "Save and Continue" option.
  6) Reset all details with the "Reset" button  
        
```
## Admin

```javascript
  1)  Restrict access to the portal if correct credentials are not entered or the user is not logged in.
  2)  Successfully store and update data for found child reports.
  3)  Successfully store data for missing child reports.
        
```


## Tech Stack

**Client:** HTML, CSS, JavaScript, JQuery

**Server:**  Express.js

**Database:** MongoDB, PostgreSQL

**APIs:** Multer, NodeMailer


## Run Locally

Clone the project

```bash
  git clone https://github.com/Deep5Varshney/khoya-paya.git
```

Go to the project directory

```bash
  cd .\routers\
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  nodemon userRouter
```


## Some Screenshots

## Home page
![screencapture-192-168-1-107-5501-main-html-2024-08-19-22_51_03](https://github.com/user-attachments/assets/5ac7379d-f007-44ab-b594-67c9563dc4b2)

## Log-in interface
![Screenshot 2024-08-28 202550](https://github.com/user-attachments/assets/1a0eb32f-0702-42d2-b3f7-fa9842563147)

## Lost child page
![screencapture-192-168-1-107-5501-lostchild-html-2024-08-19-21_27_18](https://github.com/user-attachments/assets/1c6ae57e-4eca-48b5-8f28-05f878cca564)

## Found child page
![screencapture-192-168-1-107-5501-foundChild-html-2024-08-19-21_31_48](https://github.com/user-attachments/assets/da3e3fbe-cd75-4c4d-b226-9491a3e2aa1d)

## Track child page
![Screenshot 2024-08-19 183246](https://github.com/user-attachments/assets/a6ea8be5-7e2c-4fd2-b609-99e2ccc879db)

## child details page
a. First complaint report result with matching of 81%.
![Screenshot 2024-08-19 183640](https://github.com/user-attachments/assets/2077ae81-8cde-4d85-b7ad-81a2e33a2e67)
b. Second complaint report result with matching of 54%.
![Screenshot 2024-08-19 183700](https://github.com/user-attachments/assets/46cb79e5-8350-499a-b08e-7453d2194b86)



