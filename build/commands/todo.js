"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
exports.todoCommand = {
    name: 'todo',
    execute: ({ db }) => db.tickets.getTickets().then(tickets => ({
        title: 'Open Tickets',
        fields: tickets
            .sort((a, b) => a._id - b._id)
            .map(ticket => ({
            name: `Ticket #${ticket._id}`,
            value: `_Created/last edited at ${util_1.dateToString(ticket.createdAt)} by <@${ticket.userID}>_\n\n${ticket.content}`
        })).slice(-25)
    }))
};
