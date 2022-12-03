import schedule from 'node-schedule';

export default (clock) => {
  /**
   * RecurrenceRule properties
   * @param {Number} second (0-59)
   * @param {Number} minute (0-59)
   * @param {Number} hour (0-23)
   * @param {Number} day (1-31)
   * @param {Number} month (0-11)
   * @param {Number} dayOfWeek (0-6) Starting with Sunday
   */
  const getRuleTZ = function (second, minute, hour, day, month, dayOfWeek) {
    let rule = new schedule.RecurrenceRule();

    rule.tz = 'America/Sao_Paulo';
    second !== '*' ? (rule.second = second) : false;
    minute !== '*' ? (rule.minute = minute) : false;
    hour !== '*' ? (rule.hour = hour) : false;
    day !== '*' ? (rule.date = day) : false;
    month !== '*' ? (rule.month = month) : false;
    dayOfWeek !== '*' ? (rule.dayOfWeek = dayOfWeek) : false;
    return rule;
  };

  const increment = function () {
    schedule.scheduleJob(
      '*/1 * * * * *',
      async function () {
        clock.tick();
        console.log('tick - '+ clock.timestamp);
      },
    );
  };

  return {
    schedule: schedule,
    increment: increment,
  };
};
