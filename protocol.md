1. contests time
   *add_question*
   *delete_question*
   *edit_question*
   *delete_contest*

2. Host time

stage 1 
**set banner**
**set name**
**set summary(description)**
**open or close**
if (global) {
add **categories**
&
**tags**
} if (private) go on;


stage 2
**blitz or rapid**
if (rapid) set total time
if (blitz) { 1. set specific time for all question
// 2. set specific time for each question
}

stage 3 
**set join limit**
**set start time**
**set pin**

*host_contest*
*edit_host_contest*


3. Preparation time
*unlock_&_lock_chat* *default = unlocked*
*people who joined can add messages to chats*
*people who didnt join cannot see chats or add messages*
*hoster can kick_out anyone whom he pleases*
   *view_all_open_contests*
   *join_contest*
   *join_contest_with_pin*
   *leave_contest*
  

4. Contest time
   __hoster__
   *send_announcement*
   *unlock_&_lock_chat* *default = locked*
   *hoster cannot kick_out anyone whom he pleases*

   __participants__
   *answer_a_questions*
   *add_message_to_chat*

5. Contests aftermath
  *results page*
  *questions and their corrections*

6. miscellaneous
   *fetch_leaderboard*
   *fetch_based_of_off_category*
   *report_person*


   
**notes**
1. all chats in the chats colection gets deleted automatically after a day
2. completed hosted contest gets moved to the records collection immediately and afterwards deleted, hence, any record can afterwards can only be seen from the records collection
3. the waiting/prep arena is the same url as the game arena and the records arena

krowdee/app/:userId/contest/:id
krowdee/app/host
krowdee/app/arena/:id


**leaderboard**


