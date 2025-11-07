"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  type: string;
  relatedTo: string;
  relatedId: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/activities?type=MEETING,CALL");
      if (response.ok) {
        const data = await response.json();
        // Transform activities to calendar events
        const transformedEvents = data.map((activity: any) => ({
          id: activity.id,
          title: activity.subject || "Untitled Event",
          description: activity.description || "",
          startTime: activity.dueDate || activity.createdAt,
          endTime: activity.dueDate || activity.createdAt,
          type: activity.type,
          relatedTo: activity.lead ? "Lead" : activity.deal ? "Deal" : activity.contact ? "Contact" : "Activity",
          relatedId: activity.leadId || activity.dealId || activity.contactId || ""
        }));
        setEvents(transformedEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getEventsForDay = (day: number) => {
    const { year, month } = getDaysInMonth(currentDate);
    const dayDate = new Date(year, month, day);
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === dayDate.toDateString();
    });
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  if (loading) {
    return <div className="p-8">Loading calendar...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">Schedule and manage your activities</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            + New Event
          </button>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white p-4 rounded-lg border mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded">
            ← Prev
          </button>
          <h2 className="text-xl font-semibold">{monthName}</h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded">
            Next →
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            Today
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 text-sm rounded-lg ${viewMode === "month" ? "bg-blue-600 text-white" : "border hover:bg-gray-50"}`}
            onClick={() => setViewMode("month")}
          >
            Month
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-lg ${viewMode === "week" ? "bg-blue-600 text-white" : "border hover:bg-gray-50"}`}
            onClick={() => setViewMode("week")}
          >
            Week
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-lg ${viewMode === "day" ? "bg-blue-600 text-white" : "border hover:bg-gray-50"}`}
            onClick={() => setViewMode("day")}
          >
            Day
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b bg-gray-50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="p-2 text-center text-sm font-semibold text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="p-2 min-h-[120px] border-b border-r bg-gray-50" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dayEvents = getEventsForDay(day);
            const isTodayCell = isToday(day);

            return (
              <div
                key={day}
                className={`p-2 min-h-[120px] border-b border-r hover:bg-gray-50 ${
                  isTodayCell ? "bg-blue-50" : ""
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${isTodayCell ? "text-blue-600" : "text-gray-700"}`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate cursor-pointer hover:bg-blue-200"
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mt-6 bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
        </div>
        <div className="divide-y">
          {events.slice(0, 5).map(event => (
            <div key={event.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(event.startTime).toLocaleString()} • {event.type}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  {event.relatedTo}
                </span>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No upcoming events. Schedule a meeting or call to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
