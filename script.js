// --- Simulated Data (Updated for Weekly KM Goal) ---
const userData = {
    name: "Alex Johnson",
    level: 3,
    goal: "Muscle Gain & Endurance",
    pref: "Gym, Running, HIIT",
    weeklyGoalKM: 80, 
    currentWeekKM: 50.0, 
    totalWorkouts: 52,
    stats: {
        avgPace: "5:30 min/km",
        lastPR: "15 km",
        streak: "3 Weeks",
        totalDistance: "450 km"
    },
    activityLogs: [
        { id: 1, type: 'Running', date: '2025-10-09', metric: '8.5 km', duration: '50 mins', value: 8.5 },
        { id: 2, type: 'Weightlifting', date: '2025-10-07', metric: '75 kg Squat', duration: '60 mins', value: 75 },
    ],
    chartLogs: [8.0, 7.5, 9.0, 5.5, 10.0, 7.0, 6.5]
};

const localActivities = [
    { id: 201, type: 'Trekking', name: 'Sinhagad Sunrise Trek', date: 'Sat, Oct 12', time: '5:00 AM', location: 'Sinhagad Fort Base', details: 'Moderate difficulty trek up Sinhagad fort to catch the sunrise. Carry water and snacks.' },
    { id: 202, type: 'Cycling', name: 'Khadakwasla Lake Cycling', date: 'Sun, Oct 13', time: '6:30 AM', location: 'Khadakwasla Dam', details: '40km round trip cycling session around the scenic Khadakwasla Dam area. Helmets compulsory.' },
    { id: 204, type: 'Running', name: 'Decathlon Wakad 5K', date: 'Sat, Oct 19', time: '7:00 AM', location: 'Wakad Decathlon', details: 'Weekly 5K run organized by the local running club.' }
];

const workshops = [
    { id: 401, name: "Nutrition for Marathoners", type: "Workshop", location: "Kothrud", host: "Pune Dietitian", price: "₹499", enrolled: false },
    { id: 402, name: "Injury Prevention Drills", type: "Seminar", location: "Online", host: "Physio Clinic", price: "Free", enrolled: false },
    { id: 403, name: "Beginner's Power Yoga", type: "Class", location: "Viman Nagar", host: "Lotus Studio", price: "₹250", enrolled: false }
];

const fitnessGroups = [
    { id: 301, name: "Morning Runners Club", members: 15, activity: "Running", joined: true },
    { id: 302, name: "Downtown Yoga Squad", members: 8, activity: "Yoga", joined: false },
    { id: 303, name: "Evening Lifters", members: 22, activity: "Gym", joined: false }
];

const sessions = [
    { id: 101, time: "Today, 7:00 AM", location: "Central Park Track", group: "Runners Club" },
    { id: 102, time: "Tomorrow, 6:30 PM", location: "Fitness First Gym", group: "Evening Lifters" }
];


// --- DOM Element Selection ---
const navLinks = document.querySelectorAll('.nav-link');
const views = document.querySelectorAll('.view');
const detailPopup = document.getElementById('detail-popup');
const formPopup = document.getElementById('form-popup');
const goalPopup = document.getElementById('goal-popup');
const editProfilePopup = document.getElementById('edit-profile-popup');
const workoutForm = document.getElementById('workout-form');
const goalForm = document.getElementById('goal-form');
const editProfileForm = document.getElementById('edit-profile-form');
const todayActivitiesList = document.getElementById('today-activities-list');
const upcomingActivitiesList = document.getElementById('upcoming-activities-list');
const rsvpBtn = document.querySelector('.rsvp-btn');
const changeGoalBtn = document.getElementById('change-goal-btn');
const openEditProfileBtn = document.getElementById('open-edit-profile-btn');


// --- Core Functions ---

/** Helper to close all popups */
function closeAllPopups() {
    detailPopup.classList.remove('active');
    formPopup.classList.remove('active');
    goalPopup.classList.remove('active');
    editProfilePopup.classList.remove('active');
}

/** Switches the displayed view in the Single Page Application (SPA). */
function switchView(targetViewId) {
    views.forEach(view => view.classList.add('hidden-view'));
    
    const targetView = document.getElementById(targetViewId);
    if (targetView) {
        targetView.classList.remove('hidden-view');
        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if the link's data-view matches the target ID
            if (link.dataset.view === targetViewId) {
                link.classList.add('active');
            }
        });
    }
}

// 2. Render Functions

function renderDashboard() {
    // 1. Update Weekly Goal Status
    const weeklyProgress = userData.currentWeekKM / userData.weeklyGoalKM;
    const progressPercent = Math.min(weeklyProgress, 1) * 100;

    document.getElementById('weekly-progress').style.width = ${progressPercent}%;
    document.getElementById('weekly-goal-status').textContent = Goal: ${userData.currentWeekKM.toFixed(1)} / ${userData.weeklyGoalKM} km Walked/Run;

    // 2. Populate Groups (with Join option)
    const groupList = document.getElementById('group-list');
    groupList.innerHTML = fitnessGroups.map(g => `
        <div class="group-card">
            <div>
                <h4>${g.name}</h4>
                <p>${g.activity} | 👥 ${g.members}</p>
            </div>
            <button class="join-btn btn-secondary" data-group-id="${g.id}" ${g.joined ? 'disabled' : ''}>
                ${g.joined ? 'Joined!' : 'Join'}
            </button>
        </div>
    `).join('');

    // Attach event listeners to the new Join buttons
    document.querySelectorAll('.join-btn').forEach(btn => {
        btn.addEventListener('click', handleGroupJoin);
    });

    // 3. Populate Sessions (Dashboard Upcoming Sessions)
    const sessionSchedule = document.getElementById('session-schedule');
    sessionSchedule.innerHTML = sessions
        .sort((a, b) => a.id - b.id) 
        .map(s => `
        <div class="session-item view-btn" data-target="detail-popup" data-log-id="${s.id}" data-type="session">
            <strong>${s.time}</strong> - ${s.group || s.name}
        </div>
    `).join('');

    // 4. Populate Chart Snippet (Distance Trend)
    renderProgressChart(userData.chartLogs.slice(-7), document.getElementById('progress-chart-snippet'));
}


function handleGroupJoin(e) {
    const groupId = parseInt(e.target.getAttribute('data-group-id'));
    const group = fitnessGroups.find(g => g.id === groupId);
    
    if (group && !group.joined) {
        group.joined = true; // Update data model
        alert(You successfully joined the ${group.name}! Look for their sessions on the dashboard.);
        renderDashboard(); // Re-render to update button state
    }
}


function renderActivities() {
    todayActivitiesList.innerHTML = '';
    upcomingActivitiesList.innerHTML = '';

    const todayFilter = localActivities.filter(a => a.date.includes('Oct 12')); 
    const upcomingFilter = localActivities
        .filter(a => !a.date.includes('Oct 12'))
        .filter(a => !sessions.some(s => s.id === a.id)); 

    todayFilter.forEach(activity => {
        const card = document.createElement('div');
        card.classList.add('activity-card', 'view-btn');
        card.setAttribute('data-target', 'detail-popup');
        card.setAttribute('data-log-id', activity.id);
        card.setAttribute('data-type', 'local_activity');
        card.innerHTML = `
            <h4>${activity.name}</h4>
            <p><strong>${activity.type}</strong> | ${activity.time}</p>
            <p>📍 ${activity.location}</p>
        `;
        todayActivitiesList.appendChild(card);
    });

    // FIX: Upcoming activities list now includes details
    upcomingActivitiesList.innerHTML = upcomingFilter.map(activity => `
        <li class="activity-log-item view-btn" data-target="detail-popup" data-log-id="${activity.id}" data-type="local_activity">
            <strong>${activity.date}, ${activity.time}</strong> - ${activity.name} (${activity.type})
            <br>
            <small>${activity.location}</small>
        </li>
    `).join('');
}


/** Renders the Resources & Workshops view. */
function renderResources() {
    const workshopsList = document.getElementById('workshops-list');
    const articlesList = document.getElementById('articles-list');
    
    // Render Workshops with interactive Enroll buttons
    workshopsList.innerHTML = workshops.map(w => `
        <div class="resource-card">
            <h4>${w.name}</h4>
            <p><strong>Type:</strong> ${w.type} | <strong>Price:</strong> ${w.price}</p>
            <p>📍 ${w.location} | Host: ${w.host}</p>
            <button class="enroll-btn" data-workshop-id="${w.id}" ${w.enrolled ? 'disabled' : ''}>
                ${w.enrolled ? 'Enrolled' : 'Enroll Now'}
            </button>
        </div>
    `).join('');
    
    document.querySelectorAll('.enroll-btn').forEach(btn => {
        btn.addEventListener('click', handleWorkshopEnroll);
    });
    
    // Render Static Articles List
    articlesList.innerHTML = `
        <div class="resource-card"><h4>How to Fuel a 10K Run</h4><p>Guide | Read Time: 5 mins</p></div>
        <div class="resource-card"><h4>Best Gyms in Pune (2025 Review)</h4><p>Review | Read Time: 8 mins</p></div>
    `;
}

function handleWorkshopEnroll(e) {
    const workshopId = parseInt(e.target.getAttribute('data-workshop-id'));
    const workshop = workshops.find(w => w.id === workshopId);
    
    if (workshop && !workshop.enrolled) {
        workshop.enrolled = true; // Update data model
        alert(Successfully enrolled in ${workshop.name}! Check your email for details.);
        renderResources(); // Re-render the resources list
    }
}


function renderProfile() {
    // Populate profile details
    document.getElementById('user-name').textContent = ${userData.name} (Level ${userData.level});
    document.getElementById('user-goal').textContent = userData.goal;
    document.getElementById('user-pref').textContent = userData.pref;
    document.getElementById('user-workouts-logged').textContent = userData.totalWorkouts;

    const activityLogList = document.getElementById('activity-log-list');
    activityLogList.innerHTML = userData.activityLogs.map(log => `
        <li class="activity-log-item view-btn" data-target="detail-popup" data-log-id="${log.id}" data-type="workout">
            <strong>${log.date}</strong> - ${log.type}: ${log.metric}
        </li>
    `).join('');

    renderDetailedProgress();
}

/** Renders the detailed progress stats on the Profile view. */
function renderDetailedProgress() {
    document.getElementById('avg-pace').textContent = userData.stats.avgPace;
    document.getElementById('last-pr').textContent = userData.stats.lastPR;
    document.getElementById('streak').textContent = userData.stats.streak;
    document.getElementById('total-distance').textContent = userData.stats.totalDistance;
}


// --- Popup and Detail Rendering ---

function renderDetailPopup(id, type) {
    const detailTitle = document.getElementById('detail-title');
    const detailBody = document.getElementById('detail-body');
    
    // Reset RSVP button
    rsvpBtn.removeEventListener('click', rsvpActivityHandler);
    rsvpBtn.textContent = 'Action Button';
    rsvpBtn.setAttribute('data-action-id', '');
    rsvpBtn.setAttribute('data-action-type', '');
    rsvpBtn.style.display = 'block';

    let item;

    if (type === 'workout') {
        item = userData.activityLogs.find(log => log.id === id);
        if (item) {
            detailTitle.textContent = ${item.type} Log Details;
            detailBody.innerHTML = <p><strong>Type:</strong> ${item.type}</p><p><strong>Date:</strong> ${item.date}</p><p><strong>Metric:</strong> ${item.metric}</p><p><strong>Duration:</strong> ${item.duration}</p><p><strong>Value:</strong> ${item.value}</p>;
            rsvpBtn.textContent = 'Share Achievement';
            rsvpBtn.style.display = 'none'; // Workouts usually don't need RSVP
        }
    } else if (type === 'local_activity') {
        item = localActivities.find(a => a.id === id);
        if (item) {
            detailTitle.textContent = ${item.name};
            detailBody.innerHTML = `
                <p><strong>Type:</strong> ${item.type}</p>
                <p><strong>Date/Time:</strong> ${item.date} at ${item.time}</p>
                <p><strong>Location:</strong> ${item.location}</p>
                <p style="margin-top: 15px;"><strong>Details:</strong> ${item.details}</p>
                <p style="margin-top: 10px; font-weight: bold; color: var(--primary-color);">Organized by: FitTribe Admin</p>
            `;
            rsvpBtn.textContent = 'RSVP & Add to Sessions';
            
            rsvpBtn.setAttribute('data-action-id', id);
            rsvpBtn.setAttribute('data-action-type', 'local_activity');
            rsvpBtn.addEventListener('click', rsvpActivityHandler);
            rsvpBtn.style.display = 'block';
        }
    } else if (type === 'session') {
        // Handle session details if clicked from the dashboard
        item = sessions.find(s => s.id === id);
        if (item) {
             detailTitle.textContent = ${item.group || 'Scheduled Session'};
             detailBody.innerHTML = <p><strong>Time:</strong> ${item.time}</p><p><strong>Location:</strong> ${item.location}</p><p>You are already signed up for this.</p>;
             rsvpBtn.textContent = 'View Group Chat';
             rsvpBtn.style.display = 'block';
        }
    } else {
        rsvpBtn.style.display = 'none';
    }

    if (item) {
        detailPopup.classList.add('active');
    }
}


/** Handler function to process the RSVP action (Adds to sessions). */
function rsvpActivityHandler(e) {
    const id = parseInt(e.target.getAttribute('data-action-id'));
    const type = e.target.getAttribute('data-action-type');

    if (type === 'local_activity') {
        const activity = localActivities.find(a => a.id === id);
        if (activity) {
            const existingSession = sessions.find(s => s.id === id);
            
            if (!existingSession) {
                sessions.push({
                    id: activity.id,
                    time: ${activity.date}, ${activity.time},
                    location: activity.location,
                    group: activity.name, 
                    type: 'R' 
                });
                
                alert(RSVP Confirmed for ${activity.name}! Added to your Upcoming Sessions.);

                renderDashboard();
                renderActivities(); 

                closeAllPopups();
            } else {
                alert(${activity.name} is already in your Upcoming Sessions.);
            }
        }
    }
}

// 4. Progress Chart Renderer
function renderProgressChart(dataArray, container) {
    const chartSimulation = container.querySelector('.chart-simulation');
    chartSimulation.innerHTML = '';

    if (dataArray.length === 0) return;

    const minVal = Math.min(...dataArray);
    const maxVal = Math.max(...dataArray);

    dataArray.forEach(value => {
        let normalized = (maxVal === minVal) ? 0.5 : (value - minVal) / (maxVal - minVal);
        let heightPercent = 20 + (normalized * 80); 
        
        const point = document.createElement('div');
        point.classList.add('data-point');
        point.style.height = ${heightPercent}%;
        point.setAttribute('title', ${value} km); // Show KM on hover

        chartSimulation.appendChild(point);
    });
}


// --- Event Listeners and Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Data Rendering
    renderDashboard();
    renderActivities();
    renderResources();
    renderProfile(); 

    // 2. Navigation Listener (Links)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetViewId = link.dataset.view;
            switchView(targetViewId);
        });
    });

    // 3. Dynamic Detail View Listener (Event delegation for buttons/cards)
    document.querySelector('.app-container').addEventListener('click', (e) => {
        // Find the closest element that has the 'view-btn' class
        const viewBtn = e.target.closest('.view-btn');
        if (viewBtn) {
            const target = viewBtn.dataset.target;
            
            if (target === 'detail-popup') {
                const logId = parseInt(viewBtn.dataset.logId);
                const type = viewBtn.dataset.type;
                if (logId && type) {
                    renderDetailPopup(logId, type);
                }
                return;
            }
            
            if (target) {
                switchView(target);
            }
        }
    });

    // 4. Close Popups
    document.querySelectorAll('.close-popup').forEach(btn => {
        btn.addEventListener('click', closeAllPopups);
    });

    // 5. Open Log Workout Button
    document.querySelector('.log-workout-btn').addEventListener('click', () => {
        formPopup.classList.add('active');
    });

    // 6. Open Change Goal Button
    changeGoalBtn.addEventListener('click', () => {
        document.getElementById('new-goal-km').value = userData.weeklyGoalKM;
        goalPopup.classList.add('active');
    });
    
    // 7. Open Edit Profile Button
    openEditProfileBtn.addEventListener('click', () => {
        document.getElementById('edit-name').value = userData.name;
        document.getElementById('edit-goal').value = userData.goal;
        document.getElementById('edit-pref').value = userData.pref;
        editProfilePopup.classList.add('active');
    });
    
    // 8. Edit Profile Form Submission
    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        userData.name = document.getElementById('edit-name').value;
        userData.goal = document.getElementById('edit-goal').value;
        userData.pref = document.getElementById('edit-pref').value;
        
        alert('Profile details updated successfully!');
        closeAllPopups();
        renderProfile();
    });

    // 9. Log Activity Form Submission
    workoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const distance = parseFloat(document.getElementById('distance').value);
        const duration = parseFloat(document.getElementById('duration').value);
        const formError = document.getElementById('form-error');
        
        if (isNaN(distance) || isNaN(duration) || distance <= 0 || duration <= 0) {
            formError.classList.remove('hidden');
        } else {
            formError.classList.add('hidden');
            
            // Update data model
            userData.currentWeekKM += distance; 
            userData.totalWorkouts++;
            userData.stats.totalDistance = ${(parseFloat(userData.stats.totalDistance) + distance).toFixed(1)} km;
            userData.activityLogs.unshift({
                id: Date.now(),
                type: 'Running',
                date: new Date().toLocaleDateString(),
                metric: ${distance.toFixed(1)} km,
                duration: ${duration} mins,
                value: distance
            });
            userData.chartLogs.push(distance);
            
            alert(Activity Logged: ${distance.toFixed(1)} km added to your weekly goal!);
            closeAllPopups();
            workoutForm.reset();
            
            renderDashboard();
            renderProfile();
        }
    });
    
    // 10. Goal Change Form Submission
    goalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newGoal = parseInt(document.getElementById('new-goal-km').value);
        const goalError = document.getElementById('goal-error');
        
        if (isNaN(newGoal) || newGoal <= 0) {
            goalError.classList.remove('hidden');
        } else {
            goalError.classList.add('hidden');
            
            userData.weeklyGoalKM = newGoal;
            alert(Your new weekly goal is set to ${newGoal} km!);
            
            renderDashboard();
            closeAllPopups();
        }
    });
});

// Load the default view on initial load
window.addEventListener('load', () => {
    switchView('dashboard');
});