
      // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBv9RnwLfNY7xsSEISBf4JL2mv-BMijuAg",
  authDomain: "cabana-rezervari.firebaseapp.com",
  projectId: "cabana-rezervari",
  storageBucket: "cabana-rezervari.appspot.com",
  messagingSenderId: "940267206146",
  appId: "1:940267206146:web:260758f7b882dba5be991b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async function() {
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const rezervaButton = document.getElementById("rezerva");
    let selectedInfo;
    
    async function loadReservations() {
      const reservationsCollection = collection(db, "rezervari");
      const reservationsSnapshot = await getDocs(reservationsCollection);
      let events = [];
      reservationsSnapshot.forEach((doc) => {
        let data = doc.data();
        events.push({
          id: doc.id,
          title: data.nume,
          start: data["data intrare"],
          end: data["data iesire"],
          backgroundColor: data.culoare,
          borderColor: data.culoare,
          textColor: "white",
          extendedProps: {
            phone: data.telefon,
            status: 'booked'
          },
          editable: false,
          durationEditable: false
        });
      });
      return events;
    }
  
    function getRandomColor() {
      let letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  
    rezervaButton.addEventListener('click', async (e) => {
      e.preventDefault();
      const randomColor = getRandomColor();
      try {
        await addDoc(collection(db, "rezervari"), {
          nume: nameInput.value,
          telefon: phoneInput.value,
          "data intrare": selectedInfo.startStr,
          "data iesire": selectedInfo.endStr,
          culoare: randomColor
        });
        alert("Rezervarea a fost efectuată cu succes!");
        resetForm();
        selectedInfo = null;
        modal.style.display = "none";
        calendar.refetchEvents();
      } catch (error) {
        console.error("Eroare la adăugarea documentului: ", error);
      }
    });
  
    var calendarEl = document.getElementById('calendar');
    var modal = document.getElementById("reservationModal");
    var span = document.getElementsByClassName("close")[0];
    var notification = document.getElementById("notification");
    var today = new Date().toISOString().slice(0, 10);
  
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      selectable: true,
      selectHelper: true,
      events: async function(fetchInfo, successCallback, failureCallback) {
        let events = await loadReservations();
        successCallback(events);
      },
      select: function(info) {
        if (info.startStr < today) {
          alert("Nu puteți rezerva pentru zilele anterioare.");
          return;
        }
        let eventExists = calendar.getEvents().some(event => {
          return (info.start >= event.start && info.start < event.end) || 
                 (info.end > event.start && info.end <= event.end) || 
                 (info.start <= event.start && info.end >= event.end);
        });
        if (eventExists) {
          alert("Această perioadă este deja rezervată.");
          return;
        }
        resetForm();
        selectedInfo = info;
        modal.style.display = "block";
      },
      eventRender: function(info) {
        info.el.style.fontSize = "1.2em"; 
        info.el.style.fontWeight = "bold";
        info.el.style.borderRadius = "5px";
      }
    });
    calendar.render();
  
    span.onclick = function() {
      modal.style.display = "none";
    }
  
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  
    function resetForm() {
      document.getElementById("reservationForm").reset();
    }
  
    function showNotification() {
      notification.className = "notification show";
      setTimeout(function() {
        notification.className = notification.className.replace("show", "");
      }, 3000);
    }
  });