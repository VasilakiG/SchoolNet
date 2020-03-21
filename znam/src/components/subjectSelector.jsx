import React, { Component } from "react";

import { Card, CardContent, ButtonBase } from '@material-ui/core';

import LockIcon from '@material-ui/icons/Lock';

import './../styles/subject_selector.css';

class SubjectSelector extends Component {
    renderSubjects() {
        let subjectDOM = [];
        let subjectName = ["МАТЕМАТИКА", "ИСТОРИЈА"];

        for (let i = 0; i < 9; i++) {
            subjectDOM.push(
                <div class="subject">
                    <Card>
                        <ButtonBase
                            onClick={event => {
                                console.log("clicked");
                            }}
                        >
                            <CardContent>
                                <div class="subject-content">
                                    <div class="subject-icon">
                                        <div class="center-vh">
                                            <LockIcon style={
                                                {
                                                    width: "1.5em", 
                                                    height: "1.5em"
                                                }}/>
                                        </div>
                                    </div>
                                    <div class="subject-name">
                                        {subjectName[i]}
                                    </div>
                                </div>
                            </CardContent>
                        </ButtonBase>
                    </Card>
                </div>
            );
        }

        return subjectDOM;
    }

    render() {
        return (
            <div id="selector-subject-container">
                <div id="selector-subject">
                    { this.renderSubjects() }
                </div>
            </div>
        );
    }
}

export default SubjectSelector;