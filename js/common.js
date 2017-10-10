function processData(rawData) {
    var data = rawData;

    var i = 0;
    var j = 0;

    var department_categories = [];
    var department_values = [];

    var department_gender_male = [];
    var department_gender_female = [];

    var rank_categories = [];
    var rank_values = [];

    var salary_categories = [];
    var salary_categories_names = [];
    var salary_values = [];

    var employment_date_categories = [];
    var employment_date_values = [];

    var data_score_categories = [];
    var data_score_values = [];

    var pattern_salary_group = [
        {
            name: '< $5000',
            from: 0,
            to: 4999
        },
        {
            name: '$5000 - $6000',
            from: 5000,
            to: 5999
        },
        {
            name: '$6000 - $7000',
            from: 6000,
            to: 6999
        },
        {
            name: '$7000 - $8000',
            from: 7000,
            to: 7999
        },
        {
            name: '> $8000',
            from: 8000
        }

    ];

    var list;

    for (i = 0; i < pattern_salary_group.length; i++) {
        pattern_salary_group[i].to = pattern_salary_group[i].to !== undefined ? pattern_salary_group[i].to : 'x';
        salary_categories.push([pattern_salary_group[i].from, pattern_salary_group[i].to]);
        salary_categories_names.push(pattern_salary_group[i].name);
        salary_values.push(0);
    }

    for (i = 0; i < data.length; i++) {
        if (department_categories.indexOf(data[i]['department']) == -1) {
            department_categories.push(data[i]['department']);
            department_values.push(0);
            department_gender_male.push(0);
            department_gender_female.push(0);
        }
        if (rank_categories.indexOf(data[i]['grade']) == -1) {
            rank_categories.push(data[i]['grade']);
            rank_values.push(0);
        }
        if (employment_date_categories.indexOf(data[i]['employment-date']) == -1) {
            employment_date_categories.push(data[i]['employment-date']);
            employment_date_values.push(0);
        }
        if (data[i]['score-card'] !== undefined) {
            list = Object.getOwnPropertyNames(data[i]['score-card']);
            for (j = 0; j < list.length; j++) {
                if (data_score_categories.indexOf(list[j]) == -1) {
                    data_score_categories.push(list[j]);
                }
            }
        }
    }

    for (i = 0; i < department_categories.length; i++) {
        for (j = 0; j < data.length; j++) {
            if (department_categories[i] == data[j]['department']) {
                department_values[i] += 1;
                switch (data[j]['gender']) {
                    case 'male' :
                        department_gender_male[i] += 1;
                        break;
                    case 'female' :
                        department_gender_female[i] += 1;
                        break;
                }
            }
        }
    }

    for (i = 0; i < salary_categories.length; i++) {
        for (j = 0; j < data.length; j++) {
            if (data[j]['salary'] !== 'group') {
                if (salary_categories[i][0] <= data[j]['salary'] && salary_categories[i][1] > data[j]['salary']) {
                    salary_values[i] += 1;
                    data[j]['salary'] = 'group';
                } else {
                    if (salary_categories[i][1] === 'x' && i == salary_categories.length - 1) {
                        salary_values[salary_categories.length - 1] += 1;
                    }
                }
            }
        }
    }

    for (i = 0; i < rank_categories.length; i++) {
        for (j = 0; j < data.length; j++) {
            if (rank_categories[i] == data[j]['grade']) {
                rank_values[i] += 1;
            }
        }
    }

    for (i = 0; i < data.length; i++) {
        if (data[i]['score-card'] !== undefined) {
            data_score_values.push([data[i]['name']]);
            for (j = 0; j < data_score_categories.length; j++) {
                if (j == 0) list = Object.getOwnPropertyNames(data[i]['score-card']);
                if (data_score_categories.sort()[j] == list.sort()[j]) {
                    data_score_values[i].push(+data[i]['score-card'][list[j]]);
                } else {
                    data_score_values[i].push(0);
                    list.unshift(0);
                }
            }
        }
    }

    for (i = 0; i < employment_date_categories.length; i++) {
        for (j = 0; j < data.length; j++) {
            if (employment_date_categories[i] == data[j]['employment-date']) {
                employment_date_values[i] += 1;
            }
        }
    }

    var result = {};
    result.employment_date = {};

    for (i = 0; i < department_categories.length; i++) {
        result[department_categories[i] + '_count'] = department_values[i];
        result[department_categories[i] + '_male'] = department_gender_male[i];
        result[department_categories[i] + '_female'] = department_gender_female[i];
    }

    for (i = 0; i < rank_categories.length; i++) {
        result[rank_categories[i]] = rank_values[i];
    }

    for (i = 0; i < employment_date_categories.length; i++) {
        result.employment_date[employment_date_categories[i]] = employment_date_values[i];
    }

    result['dept_categories'] = department_categories;
    result['rank_categories'] = rank_categories;
    result['salary'] = {
        'categories': salary_categories,
        'names': salary_categories_names,
        'values': salary_values
    };
    result['employment_date_categories'] = employment_date_categories;
    result['employees_count'] = data.length;
    result['data_score_info'] = {
        'categories': data_score_categories,
        'values': data_score_values
    };

    return result;
}

function human_resources_dashboard(rawData) {
    var data = processData(rawData);

    create_gender_dept_chart(data, data.dept_categories[0], 'Gender - Manufacture Dept.', 'manufacture-dept');
    create_gender_dept_chart(data, data.dept_categories[1], 'Gender - Sales Dept.', 'sales-dept');
    create_gender_dept_chart(data, data.dept_categories[2], 'Gender - Engineering Dept.', 'engineering-dept');
    create_gender_dept_chart(data, data.dept_categories[3], 'Gender - Finance Dept.', 'finance-dept');
    create_salary_chart(data, 'Number of Employees by Monthly Salary', 'salary');
    create_rank_composition_chart(data, 'Employees Composition by Grade', 'grade-composition');
    create_employment_date_chart(data, 'Number of Employees by Year', 'employment-date');
    create_score_card_chart(data.data_score_info, 'Employees Comparison by Capability \n Estimates each category of capability in range 0 - 5 scores', 'score-card');

    function create_gender_dept_chart(data, dept, title, container) {
        var chart;
        // set data and chart type
        chart = anychart.pie([
            {name: "Male", value: data[dept + '_male']},
            {name: "Female", value: data[dept + '_female']}
        ]);
        // set chart title
        chart.title(title);
        // create empty area in pie chart
        chart.innerRadius('65%');
        // set the insideLabelsOffset
        chart.insideLabelsOffset("-55%");
        chart.padding().top('15px');

        // set chart labels settings
        var labels = chart.labels();
        labels.enabled(true);
        labels.fontColor("#60727B");
        labels.position("outside");
        labels.fontWeight('bold');
        labels.format(function () {
            return this.value
        });

        // set chart label settings
        var label_1 = chart.label(0);
        label_1.text('<span style="font-size: 32px; color: #A0B1BA;">' +
            (data[dept + '_male'] + data[dept + '_female']) + '</span>');
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

    function create_salary_chart(data, title, container) {
        var chart;
        // create bar chart
        chart = anychart.bar();
        // set chart title text settings
        chart.title(title).padding().bottom('20px');
        chart.padding().top('15px');

        var data_chart = [];

        for (var i = 0; i < data.salary.categories.length; i++) {
            data_chart.push(
                {
                    'x': data.salary.names[i],
                    'value': data.salary.values[i]
                }
            );
        }

        data_chart.reverse();
        // create area series with passed data
        var series = chart.bar(data_chart);

        // set chart labels settings
        var labels = series.labels();
        labels.enabled(true);
        labels.position('center');
        labels.anchor('center');
        labels.fontColor('white');
        labels.fontWeight('bold');

        var tooltip = series.tooltip();
        // set tooltip formatter
        tooltip.titleFormat(function () {
            return this.x
        });
        tooltip.format(function () {
            return parseInt(this.value) + ' employees';
        });
        tooltip.position('right').anchor('left-center');
        tooltip.title().align('center');

        // set yAxis labels formatter
        chart.yAxis().labels().format(function () {
            return this.value.toLocaleString();
        });
        chart.interactivity().hoverMode('by-x');
        chart.tooltip().positionMode('point');
        // set scale minimum
        chart.yScale().minimum(0);
        chart.yScale().ticks().interval(10);
        chart.yAxis().minorTicks().enabled(true);
        // set container id for the chart
        chart.container(container);
        // initiate chart drawing
        chart.draw();
    }

    function create_rank_composition_chart(data, title, container) {
        var chart;
        // set data and chart type
        var data_chart = [];

        for (var i = 0; i < data.rank_categories.length; i++) {
            data_chart.push(
                {
                    'name': data.rank_categories[i],
                    'value': data[data.rank_categories[i]]
                }
            );
        }

        data_chart.sort(function (a, b) {
            return a.name - b.name
        });

        chart = anychart.pie(data_chart);
        chart.title(title);
        // create empty area in pie chart
        chart.innerRadius('65%');
        chart.padding().top('15px');

        var tooltip = chart.tooltip();
        tooltip.titleFormat(function () {
            return this.name + ' grade';
        });
        tooltip.format(function () {
            var employees = employees_data();
            return 'Employees: ' + this.value + '\n' + 'Percent value: ' +
                (this.value / employees.length * 100).toFixed(2) + '%';
        });

        // set chart labels settings
        var labels = chart.labels();
        // adding the offsets
        labels.enabled(true);
        labels.fontWeight('bold');
        labels.fontColor("#60727B");
        labels.position("outside");
        labels.format(function () {
            return this.value
        });

        // set chart label settings
        var label_1 = chart.label(0);
        label_1.text('<span style="font-size: 32px; color: #A0B1BA;">' +
            data.employees_count + '</span>');
        label_1.position("center");
        label_1.anchor("center");
        label_1.offsetX("-5px");
        label_1.offsetY("0px");
        label_1.useHtml(true);

        // set chart label settings
        var label_2 = chart.label(1);
        label_2.text('<span style="20px; color: #bbb;">Employees</span>');
        label_2.position("center");
        label_2.anchor("center");
        label_2.offsetX("-5px");
        label_2.offsetY("25px");
        label_2.useHtml(true);

        // set the insideLabelsOffset
        chart.insideLabelsOffset("-55%");
        // set container id for the chart
        chart.container(container);
        // init chart
        chart.draw();
    }

    function create_employment_date_chart(data, title, container) {
        var chart;
        // create column chart
        chart = anychart.column();
        // set chart title text settings
        chart.title(title).padding().bottom('20px');
        // set scale minimum
        chart.yScale().minimum(0);
        chart.yScale().ticks().interval(10);
        chart.yAxis().minorTicks().enabled(true);
        chart.padding().top('15px');

        var data_chart = [];

        for (var i = 0; i < data.employment_date_categories.length; i++) {
            data_chart.push(
                {
                    'x': data.employment_date_categories[i],
                    'value': data.employment_date[data.employment_date_categories[i]]
                }
            );
        }

        data_chart.sort(function (a, b) {
            return a.x - b.x
        });

        // create area series with passed data
        var series = chart.column(data_chart);

        // set chart labels settings
        var labels = series.labels();
        // adding the offsets
        labels.enabled(true);
        labels.position('center');
        labels.anchor('center');
        labels.fontColor('white');
        labels.fontWeight('bold');

        chart.interactivity().hoverMode('single');
        chart.tooltip().positionMode('point');

        // set tooltip formatter
        series.tooltip().titleFormat(function () {
            return this.x
        });
        series.tooltip().format(function () {
            return parseInt(this.value) + ' employees';
        });
        series.tooltip().position('center-top').anchor('center-bottom');
        series.tooltip().title().align('center');
        // set yAxis labels formatter
        chart.yAxis().labels().format(function () {
            return this.value.toLocaleString();
        });

        // set container id for the chart
        chart.container(container);
        // initiate chart drawing
        chart.draw();
    }

    function create_score_card_chart(data_score_card, title, container) {
        var chart;
        // add empty data
        data_score_card.values.filter(function (arr) {
            arr.push(0);
        });

        var dataSet = anychart.data.set(data_score_card.values);
        // create bar chart
        chart = anychart.column();

        for (var i = 0; i < data_score_card.categories.length; i++) {
            chart.column(dataSet.mapAs({x: [0], value: [i + 1]})).name(data_score_card.categories[i]);

            if (i == data_score_card.categories.length - 1) {
                //  create series empty, for eval sum statistic
                var series_empty = chart.column(dataSet.mapAs(
                    {
                        x: [0],
                        value: [data_score_card.categories.length + 1]
                    }
                ));
                series_empty.name('Empty');
                series_empty.fill(null);
                series_empty.stroke(null);
                series_empty.legendItem(null);
                series_empty.tooltip(null);

                var series_empty_labels = series_empty.labels();
                series_empty_labels.enabled(true);
                series_empty_labels.position('center-top');
                series_empty_labels.anchor('center-bottom');
                series_empty_labels.format(function () {
                    return this.series.getPoint(this.index).getStat('categoryYSum');
                });
            }
        }

        // force chart to stack values by Y scale.
        chart.yScale()
            .stackMode('value')
            .stackDirection('reverse');
        // set chart title text settings
        chart.title(title).padding().bottom('20px');
        chart.xAxis().labels().rotation(-90);
        chart.interactivity().hoverMode('by-x');
        // turn on legend
        chart.legend().enabled(true).fontSize(13).padding([0, 0, 20, 0]);
        chart.tooltip().displayMode('union').format('{%SeriesName}: {%Value}');
        chart.padding().top('15px');
        // hidden labels statistic if all series enabled false
        chart.listen('legenditemmouseup', function () {
            var series_count = chart.getSeriesCount();
            var labels = chart.getSeries(series_count - 1).labels();
            var flag = true;

            for (var i = 0; i < series_count - 1; i++) {
                if (chart.getSeries(i).enabled() === true) {
                    flag = true;
                    break;
                } else {
                    flag = false;
                }
            }

            if (!flag) {
                labels.enabled(false);
            } else {
                labels.enabled(true);
            }
        });

        // gets scroller
        var scroller = chart.xScroller();
        scroller.enabled(true);
        scroller.position('before-axes');

        // turn it on
        var xZoom = chart.xZoom();
        xZoom.setTo(0, 0.2);

        // set container id for the chart
        chart.container(container);
        // initiate chart drawing
        chart.draw();
    }
}

function heightInit() {
    var mq = window.matchMedia("(min-width: 768px)");
    var $chart = $('.chart');
    var $scoreCard = $('#score-card');
    // sum of padding and margin height
    var offsetHeight = 45;

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
    // replace this line with your data
    var rawData = employees_data();
    // draw dashboard
    human_resources_dashboard(rawData);
});

$(window).on('load', function () {
    hidePreloader();
});

$(window).resize(function () {
    heightInit();
});


