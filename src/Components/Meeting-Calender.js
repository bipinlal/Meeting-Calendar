import React, {Component} from "react";
import "../CSS/custom-style.css";
import data from "../json/sample-data.json";
export default class Meeting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			SelDate: "2015-05-24",
			JsonData: data,
			Daydata: [],
			eventrows: []
		};
	}
	convertDate = str => {
		var date = new Date(str),
			mnth = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2);
		return [date.getFullYear(), mnth, day].join("-");
	};
	formatAMPM(date) {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	}
	OnPrevDayClick() {
		let Newdate = new Date(document.getElementById("date-selected").value);
		Newdate.setDate(Newdate.getDate() - 1);
		let ConvertedDate = this.convertDate(Newdate);
		let result = this.state.JsonData.filter(item => this.convertDate(item.startTime) === ConvertedDate);
		this.setState({
			SelDate: ConvertedDate,
			Daydata: result
		});
		this.LoadEvents(result);
	}
	OnNextDayClick() {
		let Newdate = new Date(document.getElementById("date-selected").value);
		Newdate.setDate(Newdate.getDate() + 1);
		let ConvertedDate = this.convertDate(Newdate);
		let result = this.state.JsonData.filter(item => this.convertDate(item.startTime) === ConvertedDate);
		this.setState({
			SelDate: ConvertedDate,
			Daydata: result
		});
		this.LoadEvents(result);
	}
	LoadEvents = (Daydata) => {
		let eventrows = [];
		Daydata.map(item => {
			let date_start_item = new Date(item.startTime), date_end_item = new Date(item.endTime);
			let Timestart_H = date_start_item.getHours(), Timeend_H = date_end_item.getHours();
			let Time_start_12 = this.formatAMPM(date_start_item);
			let Time_end_12 = this.formatAMPM(date_end_item);
			/* start time minutes adding to hours */
			if (date_start_item.getMinutes() === 15) {
				Timestart_H = Timestart_H + .25;
			} else if (date_start_item.getMinutes() === 30) {
				Timestart_H = Timestart_H + .5;
			} else if (date_start_item.getMinutes() === 45) {
				Timestart_H = Timestart_H + .75;
			}
			/* End Time minutes adding to hours */
			if (date_end_item.getMinutes() === 15) {
				Timeend_H = Timeend_H + .25;
			} else if (date_end_item.getMinutes() === 30) {
				Timeend_H = Timeend_H + .5;
			} else if (date_end_item.getMinutes() === 45) {
				Timeend_H = Timeend_H + .75;
			}
			let TopPos = document.getElementById(Timestart_H).offsetTop;
			let bottomPos = document.getElementById(Timeend_H).offsetTop;
			let Height=(bottomPos-TopPos)-7;
			const tdStyle = {
				top: `${TopPos}px`,
				height: `${Height}px`
			}
			return eventrows.push(<tr className="day-row-filled">
				<td className="event-col-filled" style={tdStyle}> {
					item.title
				} <br />
					<span>{Time_start_12 + " - " + Time_end_12}</span>
				</td>
			</tr>);
		});
		this.setState({eventrows});
	};
	componentDidMount() {
		let Daydata = this.state.JsonData.filter(item => this.convertDate(item.startTime) === "2015-05-24")
		this.LoadEvents(Daydata);
	}
	render() {
		var rows = [],
		val = 0.0,
		DispVal = 0.0,
		meridian = "AM";
		for (var i = 0; i < 96; i++) {
			if (i >= 48) {
				meridian = "PM";
			}
			if (i >= 52) {
				DispVal = val - 12;
			} else {
				DispVal = val;
			}
			if (DispVal % 1 === 0) {
				rows.push(<tr className="day-row">
					<td id={val} className="time-col">{(DispVal===0?12:DispVal) + " " + meridian}</td>
					<td className="event-col">&nbsp;</td></tr>
				);
			}
			else {
				rows.push(<tr className="day-row"><td id={val} className="time-col-index">&nbsp;</td><td>&nbsp;</td></tr>);
			}
			val += 0.25;
		}
	return (
		<div className="day-schedule">
			<div className="calendar-nav">
				<button onClick={() => this.OnPrevDayClick()}>&lt;</button>
                <button id="date-selected" value={this.state.SelDate}>{this.state.SelDate}</button>
				<button onClick={() => this.OnNextDayClick()}>&gt;</button>
			</div>
			<table className="day-table">
				<thead>
					<tr>
						<th colSpan="2" className="text-center">Events</th>
					</tr>
				</thead>
				<tbody className="day-table-body">{rows}{this.state.eventrows}</tbody>
			</table>
		</div>
    );
  }
}