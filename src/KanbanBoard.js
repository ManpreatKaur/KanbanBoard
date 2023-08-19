import React, { useState, useEffect } from 'react';
import './Kanban.css';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [groupingOption, setGroupingOption] = useState('status');
  const [sortOption, setSortOption] = useState('priority');

  useEffect(() => {
    // Fetch tickets from the API and update the state
    const fetchTickets = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await response.json();
        setTickets(data.tickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  const handleGroupingOptionChange = (event) => {
    setGroupingOption(event.target.value);
  };

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  // Group tickets based on the selected grouping option
  const groupedTickets = groupTickets(tickets, groupingOption);

  // Sort tickets based on the selected sort option
  const sortedTickets = sortTickets(groupedTickets, sortOption);

  return (
    <div>
      {/* Grouping options */}
      <div>
        <label htmlFor="grouping">Grouping</label>
        <select id="grouping" value={groupingOption} onChange={handleGroupingOptionChange}>
          <option value="status">Status</option>
          <option value="user">User</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {/* Sort options */}
      <div>
        <label htmlFor="sorting">Sorting</label>
        <select id="sorting" value={sortOption} onChange={handleSortOptionChange}>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>

      {/* Kanban board */}
      <div>
        {sortedTickets.map((group) => (
          <div key={group.key}>
            <h2>{group.key}</h2>
            <ul>
              {group.tickets.map((ticket) => (
                <li key={ticket.id}>{ticket.title}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to group tickets based on the selected option
const groupTickets = (tickets, option) => {
  if (option === 'status') {
    // Group by status
    const groups = {};
    tickets.forEach((ticket) => {
      if (!groups[ticket.status]) {
        groups[ticket.status] = [];
      }
      groups[ticket.status].push(ticket);
    });
    return Object.keys(groups).map((key) => ({
      key,
      tickets: groups[key],
    }));
  } else if (option === 'user') {
    // Group by user
    const groups = {};
    tickets.forEach((ticket) => {
      if (!groups[ticket.userId]) {
        groups[ticket.userId] = [];
      }
      groups[ticket.userId].push(ticket);
    });
    return Object.keys(groups).map((key) => ({
      key,
      tickets: groups[key],
    }));
  } else if (option === 'priority') {
    // Group by priority
    const groups = {};
    tickets.forEach((ticket) => {
      if (!groups[ticket.priority]) {
        groups[ticket.priority] = [];
      }
      groups[ticket.priority].push(ticket);
    });
    return Object.keys(groups)
      .sort((a, b) => b - a) // Sort priorities in descending order
      .map((key) => ({
        key,
        tickets: groups[key],
      }));
  }
};

// Helper function to sort tickets based on the selected option
const sortTickets = (groups, option) => {
  if (option === 'priority') {
    // Sort by priority within each group
    return groups.map((group) => ({
      ...group,
      tickets: group.tickets.sort((a, b) => b.priority - a.priority),
    }));
  } else if (option === 'title') {
    // Sort by title within each group
    return groups.map((group) => ({
      ...group,
      tickets: group.tickets.sort((a, b) => a.title.localeCompare(b.title)),
    }));
  }
};

export default KanbanBoard;
