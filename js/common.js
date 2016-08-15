(function () {
    var data = employees_data();

    var manufacture_dept = [];
    var sales_dept = [];
    var engineering_dept = [];
    var finance_dept = [];

    var salary_group_1 = [];
    var salary_group_2 = [];
    var salary_group_3 = [];
    var salary_group_4 = [];
    var salary_group_5 = [];

    var staff_composition_engineer = [];
    var staff_composition_Engineer_professor = [];
    var staff_composition_senior_assistant = [];
    var staff_composition_senior_engineer = [];

    var employment_date_group_1 = [];
    var employment_date_group_2 = [];
    var employment_date_group_3 = [];
    var employment_date_group_4 = [];
    var employment_date_group_5 = [];

    var data_score_card = [];

    data.filter(function (employee) {

        switch (employee.department) {
            case 'manufacture' :
                manufacture_dept.push(employee);
                break;
            case 'sales' :
                sales_dept.push(employee);
                break;
            case 'engineering' :
                engineering_dept.push(employee);
                break;
            case 'finance' :
                finance_dept.push(employee);
                break;
        }

        switch (true) {
            case employee.salary < 5000 :
                salary_group_1.push(employee);
                break;
            case employee.salary < 6000 :
                salary_group_2.push(employee);
                break;
            case employee.salary < 7000 :
                salary_group_3.push(employee);
                break;
            case employee.salary < 8000 :
                salary_group_4.push(employee);
                break;
            case employee.salary >= 8000 :
                salary_group_5.push(employee);
                break;
        }

        switch (employee.staff) {
            case 'Engineer' :
                staff_composition_engineer.push(employee);
                break;
            case 'Engineer Professor' :
                staff_composition_Engineer_professor.push(employee);
                break;
            case 'Engineer Assistant' :
                staff_composition_senior_assistant.push(employee);
                break;
            case 'Senior Engineer' :
                staff_composition_senior_engineer.push(employee);
                break;
        }

        switch (employee['employment-date']) {
            case '2012' :
                employment_date_group_1.push(employee);
                break;
            case '2013' :
                employment_date_group_2.push(employee);
                break;
            case '2014' :
                employment_date_group_3.push(employee);
                break;
            case '2015' :
                employment_date_group_4.push(employee);
                break;
            case '2016' :
                employment_date_group_5.push(employee);
                break;
        }

        data_score_card.push(
            [
                employee['name'],
                +employee['communication-skills'],
                +employee['technical-knowledge'],
                +employee['teamwork'],
                +employee['meeting-deadline'],
                +employee['problem-solving'],
                +employee['punctuality'],
                // for empty series
                0
            ]
        )

    });

    var manufacture_dept_male = returnMaleOrFemaleDept(manufacture_dept, 'male');
    var manufacture_dept_female = returnMaleOrFemaleDept(manufacture_dept, 'female');
    var sales_dept_male = returnMaleOrFemaleDept(sales_dept, 'male');
    var sales_dept_female = returnMaleOrFemaleDept(sales_dept, 'female');
    var engineering_dept_male = returnMaleOrFemaleDept(engineering_dept, 'male');
    var engineering_dept_female = returnMaleOrFemaleDept(engineering_dept, 'female');
    var finance_dept_male = returnMaleOrFemaleDept(finance_dept, 'male');
    var finance_dept_female = returnMaleOrFemaleDept(finance_dept, 'female');

    function returnMaleOrFemaleDept(dept, gender) {
        return dept.filter(function (employee) {
            if (employee.gender == gender) {
                return employee
            }
        })
    }

    function create_gender_dept_chart(dept_male, dept_female, title, container) {
        // set data and chart type
        chart = anychart.pie([
            {name: "Male", value: dept_male.length},
            {name: "Female", value: dept_female.length}
        ]);
        // set chart title
        chart.title(title);
        // create empty area in pie chart
        chart.innerRadius('65%');
        chart.overlapMode(true);
        // set the insideLabelsOffset
        chart.insideLabelsOffset("-55%");

        // set chart labels settings
        var labels = chart.labels();
        labels.enabled(true);
        labels.fontColor("#60727B");
        labels.position("outside");
        labels.fontWeight('bold');
        labels.textFormatter(function () {
            return this.value
        });

        // set chart label settings
        var label_1 = chart.label(0);
        label_1.text('<span style="font-size: 32px; color: #A0B1BA;">' +
            (dept_male.length + dept_female.length) + '</span>');
        label_1.position("center");
        label_1.anchor("center");
        label_1.offsetX("-5px");
        label_1.offsetY("-10px");
        label_1.useHtml(true);

        // set chart label settings
        var label_2 = chart.label(1);
        label_2.text('<span style="20px; color: #bbb;">Employees</span>');
        label_2.position("center");
        label_2.anchor("center");
        label_2.offsetX("-5px");
        label_2.offsetY("15px");
        label_2.useHtml(true);

        // set container id for the chart
        chart.container(container);
        // init chart
        chart.draw();
    }

    function create_salary_chart() {
        // create bar chart
        chart = anychart.bar();
        // set chart title text settings
        chart.title('Number of Employees by Monthly Salary').padding().bottom('20px');

        // create area series with passed data
        var series = chart.bar([
            ['> $8000', salary_group_5.length],
            ['$7000 - $8000', salary_group_4.length],
            ['$6000 - $7000', salary_group_3.length],
            ['$5000 - $6000', salary_group_2.length],
            ['< $5000', salary_group_1.length]
        ]);

        // set chart labels settings
        var labels = series.labels();
        labels.enabled(true);
        labels.position('center');
        labels.anchor('center');
        labels.fontColor('white');
        labels.fontWeight('bold');

        var tooltip = series.tooltip();
        // set tooltip formatter
        tooltip.titleFormatter(function () {
            return this.x
        });
        tooltip.textFormatter(function () {
            return parseInt(this.value) + ' employees';
        });
        tooltip.position('right').anchor('left');
        tooltip.offsetX(5).offsetY(0);
        tooltip.title().align('center');

        // set yAxis labels formatter
        chart.yAxis().labels().textFormatter(function () {
            return this.value.toLocaleString();
        });
        chart.interactivity().hoverMode('byX');
        chart.tooltip().positionMode('point');
        // set scale minimum
        chart.yScale().minimum(0);
        chart.yScale().ticks().interval(10);
        chart.yAxis().minorTicks().enabled(true);
        // set container id for the chart
        chart.container('salary');
        // initiate chart drawing
        chart.draw();
    }

    function create_staff_composition_chart() {
        // set data and chart type
        chart = anychart.pie([
            {name: "Engineer", value: staff_composition_engineer.length},
            {name: "Engineer Professor", value: staff_composition_Engineer_professor.length},
            {name: "Engineer Assistant", value: staff_composition_senior_assistant.length},
            {name: "Senior Engineer", value: staff_composition_senior_engineer.length}
        ]);
        chart.title('Engineering Department Staff Composition');
        // create empty area in pie chart
        chart.innerRadius('65%');

        // set chart labels settings
        var labels = chart.labels();
        // adding the offsets
        labels.enabled(true);
        labels.fontWeight('bold');
        labels.fontColor("#60727B");
        labels.position("outside");
        labels.textFormatter(function () {
            return this.value
        });

        // set chart label settings
        var label_1 = chart.label(0);
        label_1.text('<span style="font-size: 32px; color: #A0B1BA;">' +
            (data.length) + '</span>');
        label_1.position("center");
        label_1.anchor("center");
        label_1.offsetX("-5px");
        label_1.offsetY("-10px");
        label_1.useHtml(true);

        // set chart label settings
        var label_2 = chart.label(1);
        label_2.text('<span style="20px; color: #bbb;">Employees</span>');
        label_2.position("center");
        label_2.anchor("center");
        label_2.offsetX("-5px");
        label_2.offsetY("15px");
        label_2.useHtml(true);

        chart.overlapMode(true);
        // set the insideLabelsOffset
        chart.insideLabelsOffset("-55%");
        // set container id for the chart
        chart.container('staff-composition');
        // init chart
        chart.draw();
    }

    function create_employment_date_chart() {
        // create column chart
        chart = anychart.column();
        // set chart title text settings
        chart.title('Number of Employees by Year').padding().bottom('20px');
        // set scale minimum
        chart.yScale().minimum(0);
        chart.yScale().ticks().interval(10);
        chart.yAxis().minorTicks().enabled(true);

        // create area series with passed data
        var series = chart.column([
            ['2012', employment_date_group_1.length],
            ['2013', employment_date_group_2.length],
            ['2014', employment_date_group_3.length],
            ['2015', employment_date_group_4.length],
            ['2016', employment_date_group_5.length]
        ]);

        // set chart labels settings
        var labels = series.labels();
        // adding the offsets
        labels.enabled(true);
        labels.position('center');
        labels.anchor('center');
        labels.fontColor('white');
        labels.fontWeight('bold');

        chart.interactivity().hoverMode('byX');
        chart.tooltip().positionMode('point');

        // set tooltip formatter
        series.tooltip().titleFormatter(function () {
            return this.x
        });
        series.tooltip().textFormatter(function () {
            return parseInt(this.value) + ' employees';
        });
        series.tooltip().position('topCenter').anchor('centerBottom').offsetX('-10px');
        series.tooltip().title().align('center');
        // set yAxis labels formatter
        chart.yAxis().labels().textFormatter(function () {
            return this.value.toLocaleString();
        });

        // set container id for the chart
        chart.container('employment-date');
        // initiate chart drawing
        chart.draw();
    }

    function create_score_card_chart() {
        // create data set on our data
        var dataSet = anychart.data.set(data_score_card);
        // map data for the first series, take x from the zero column and value from the first column of data set
        var series_communication_skills_data = dataSet.mapAs({x: [0], value: [1]});
        // map data for the second series, take x from the zero column and value from the second column of data set
        var series_technical_knowledge_data = dataSet.mapAs({x: [0], value: [2]});
        // map data for the third series, take x from the zero column and value from the third column of data set
        var series_teamwork_data = dataSet.mapAs({x: [0], value: [3]});
        // map data for the fourth series, take x from the zero column and value from the fourth column of data set
        var series_meeting_deadline_data = dataSet.mapAs({x: [0], value: [4]});
        // map data for the fifth series, take x from the zero column and value from the fifth column of data set
        var series_problem_solving_data = dataSet.mapAs({x: [0], value: [5]});
        // map data for the sixth series, take x from the zero column and value from the sixth column of data set
        var series_punctuality_data = dataSet.mapAs({x: [0], value: [6]});
        // map data for the seventh series, take x from the zero column and value from the seventh column of data set
        var series_empty_data = dataSet.mapAs({x: [0], value: [7]});

        // create bar chart
        chart = anychart.column();
        // force chart to stack values by Y scale.
        chart.yScale().stackMode('value');
        // set chart title text settings
        chart.title('Capability Score Card per Employee').padding().bottom('20px');
        chart.xAxis().labels().rotation(-90);
        chart.interactivity().hoverMode('byX');
        // turn on legend
        chart.legend().enabled(true).fontSize(13).padding([0, 0, 20, 0]);
        chart.tooltip().displayMode('union');

        // create first series with mapped data
        var series_communication_skills = chart.column(series_communication_skills_data);
        series_communication_skills.name('Communication Skills');

        // create second series with mapped data
        var series_technical_knowledge = chart.column(series_technical_knowledge_data);
        series_technical_knowledge.name('Technical Knowledge');

        // create third series with mapped data
        var series_teamwork = chart.column(series_teamwork_data);
        series_teamwork.name('Teamwork');

        // create fourth series with mapped data
        var series_meeting_deadline = chart.column(series_meeting_deadline_data);
        series_meeting_deadline.name('Meeting Deadline');

        // create fifth series with mapped data
        var series_problem_solving = chart.column(series_problem_solving_data);
        series_problem_solving.name('Problem Solving');

        // create sixth series with mapped data
        var series_punctuality = chart.column(series_punctuality_data);
        series_punctuality.name('Punctuality');

        // create series empty, for eval sum statistic and
        var series_empty = chart.column(series_empty_data);
        series_empty.fill(null);
        series_empty.stroke(null);
        series_empty.legendItem(null);
        series_empty.tooltip(null);

        var series_empty_labels = series_empty.labels();
        series_empty_labels.enabled(true);
        series_empty_labels.position('top');
        series_empty_labels.anchor('bottom');
        series_empty_labels.textFormatter(function () {
            return this.series.getPoint(this.index).getStat('categoryYSum');
        });

        // gets scroller
        var scroller = chart.xScroller();
        scroller.enabled(true);
        scroller.position('beforeAxes');

        // turn it on
        var xZoom = chart.xZoom();
        xZoom.setTo(0, 0.2);

        // set container id for the chart
        chart.container('score-card');
        // initiate chart drawing
        chart.draw();
    }

    function heightInit() {
        var mq = window.matchMedia("(min-width: 768px)");
        var $chart = $('.chart');
        var $scoreCard = $('#score-card');
        // sum of padding and margin height
        var offsetHeight = 85;

        // if parent != iframe
        if (self === top) {
            if (mq.matches) {
                var height = $(window).height() - offsetHeight;
                $chart.css('height', height / 2);
                $scoreCard.css('height', 650);
            } else {
                $chart.css('height', 350);
                $scoreCard.css('height', 550);
            }
        }
    }

    function hidePreloader() {
        $('#loader-wrapper').fadeOut('slow');
    }

    anychart.onDocumentReady(function () {
        heightInit();

        create_gender_dept_chart(manufacture_dept_male, manufacture_dept_female, 'Gender - Manufacture Dept.', 'manufacture-dept');
        create_gender_dept_chart(sales_dept_male, sales_dept_female, 'Gender - Sales Dept.', 'sales-dept');
        create_gender_dept_chart(engineering_dept_male, engineering_dept_female, 'Gender - Engineering Dept.', 'engineering-dept');
        create_gender_dept_chart(finance_dept_male, finance_dept_female, 'Gender - Finance Dept.', 'finance-dept');
        create_salary_chart();
        create_staff_composition_chart();
        create_employment_date_chart();
        create_score_card_chart();
    });

    $(window).on('load', function () {
        hidePreloader();
    });

    $(window).resize(function () {
        heightInit();
    });

})();

