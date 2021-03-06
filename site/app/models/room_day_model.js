Teknologihuset.RoomDay = DS.Model.extend({
    dayOfWeek: DS.attr('number'),
    roomWeek: DS.attr('number'),
    roomYear: DS.attr('number'),
    roomMonth: DS.attr('number'),
    dayOfMonth: DS.attr('number'),
    date: DS.attr('date'),
    room: DS.belongsTo('room', {async: true}),
    roomEvents: DS.hasMany('roomEvent'),
    halfdayEvents: DS.hasMany('roomEvent'),
    fulldayEvent: DS.belongsTo('roomEvent'),
    communityEvent: DS.belongsTo('roomEvent'),

    lessThanThreeAvailableHours: function() {
        return this.get('availableHours.length') < 3;
    }.property('availableHours'),

    availableHours: function() {
        var availableHours = [];

        this.get('sortedRoomEvents').forEach(function(roomEvent) {
            if (!roomEvent.get('googleCalId')) {
                availableHours.pushObject(roomEvent);
            }
        });

        return availableHours;
    }.property('h8', 'h9', 'h10', 'h11', 'h12', 'h13', 'h14', 'h15', 'h16', 'h17'),

    sortedRoomEvents: function() {
        var events = [];

        this.get('roomEvents').forEach(function(ev) {
            events.pushObject(ev);
        });

        var sortedEvents = Em.ArrayProxy.createWithMixins(
            Ember.SortableMixin,
            { content:events, sortProperties: ['formattedHour'] }
        );

        return sortedEvents;
    }.property('roomEvents'),

    dayLetter: function() {
        if (this.get('dayOfWeek') === 1) {
            return "M";
        } else if (this.get('dayOfWeek') === 2) {
            return "T";
        } else if (this.get('dayOfWeek') === 3) {
            return "O";
        } else if (this.get('dayOfWeek') === 4) {
            return "T";
        } else if (this.get('dayOfWeek') === 5) {
            return "F";
        } else if (this.get('dayOfWeek') === 6) {
            return "L";
        } else if (this.get('dayOfWeek') === 7) {
            return "S";
        }
    }.property('dayOfWeek'),

    delvisOpptatt: function() {
        return this.get('roomEvents').anyBy('opptatt', true);
    }.property('roomEvents.@each.googleCalId'),

    opptatt: function() {
        return this.get('roomEvents').everyBy('opptatt', true);
    }.property('roomEvents.@each.googleCalId'),

    ledig: function() {
        return this.get('roomEvents').anyBy('ledig', true);
    }.property('roomEvents.@each.googleCalId'),

    anyEventsSelected: function() {
        var selected = false;

        this.get('roomEvents').forEach(function(event) {
            if (event.get('selected')) {
                selected = true;
            }
        });

        return selected;
    }.property('roomEvents.@each.selected'),

    anyHalfdayEventsSelected: function() {
        var selected = false;

        this.get('halfdayEvents').forEach(function(event) {
            if (event.get('selected')) {
                selected = true;
            }
        });

        return selected;
    }.property('halfdayEvents.@each.selected'),

    fulldayEventSelected: function() {
        var selected = false;

        if (this.get('fulldayEvent.selected')) {
            selected = true;
        }

        return selected;
    }.property('fulldayEvent.@each.selected'),

    availableHalfdayEvents: function() {
        var events = [];

        this.get('halfdayEvents').forEach(function(event) {
            if (!event.get('googleCalId')) {
                events.pushObject(event);
            }
        });

        return events;
    }.property('halfdayEvents.@each.googleCalId')
});