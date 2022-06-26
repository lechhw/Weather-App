import React, { useEffect, useState, memo } from 'react';
import styles from './date_form.module.css';

const DateForm = memo(() => {
  const [date, setDate] = useState({
    month: '',
    date: '',
    year: '',
  });

  useEffect(() => {
    const today = new Date();
    const month = today.getMonth();
    const date = String(today.getDate()).padStart(2, 0);
    const year = today.getFullYear();

    const monthArr = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    setDate({
      month: monthArr[month],
      date: date,
      year: year,
    });
  }, []);

  return (
    <div className={styles.today}>
      <i className="fa-regular fa-calendar"></i>
      <span className={styles.month}>{date.month}</span>
      <span className={styles.date}>{`${date.date},`}</span>
      <span className={styles.year}>{date.year}</span>
    </div>
  );
});

export default DateForm;
