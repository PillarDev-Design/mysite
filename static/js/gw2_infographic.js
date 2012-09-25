/******************************************************************************\
| gw2_infographic.js                                                           |
|------------------------------------------------------------------------------|
| * What is this project?                                                      |
| -----------------------                                                      |
|       I've recently started playing a new game called GuildWars2 with my     |
| friend Erik. We came across an article on their blog with an infographic.    |
| It was extremely hard to read/understand, and we thought we'd give it a go   |
| on representing the data better.                                             |
|                                                                              |
| * What is your data?                                                         |
| --------------------                                                         |
|       Good question. I actually don't have the exact numbers that the        |
| original author had. So, I've taken their infographic -                      |
|                                                                              |
| SOURCE - https://d2vn94glaxzkz3.cloudfront.net/wp-content/uploads/2012/      |
|                     09/Gender-Profession-Race-Crafting-Graph-590x378.jpg     |
|                                                                              |
|       I loaded the jpg into GIMP and measured the pixes of each bar chart    |
| item. For the pie chart, I did a side-by-side measurement approximation...   |
| which is probably skewed anyways, because everyone knows that girls don't    |
| play MMO's.                                                                  |
\******************************************************************************/


/******************************************************************************\
| Data Extracted + Analysis                                                    |
|------------------------------------------------------------------------------|
| (RACE)                                                                       |
|                                                                              |
| NAME    | PIXELS | PERCENTAGE                                                |
| -----------------------------                                                |
| Asura   | 62     | 15.31%                                                    |
| Charr   | 58     | 14.32%                                                    |
| Human   | 141    | 34.81% *                                                  |
| Norn    | 82     | 20.25%                                                    |
| Sylvari | 62     | 15.31%                                                    |
| ------- | ------ | ----------                                                |
| TOTALS: | 405    | 100%                                                      |
|                                                                              |
|------------------------------------------------------------------------------|
| (PROFESSION)                                                                 |
|                                                                              |
| NAME         | PIXELS | PERCENTAGE                                           |
| ----------------------------------                                           |
| Elementalist | 122    | 13.39%                                               |
| Engineer     | 93     | 10.21%                                               |
| Guardian     | 113    | 12.40%                                               |
| Mesmer       | 93     | 10.21%                                               |
| Necromancer  | 103    | 11.31%                                               |
| Ranger       | 132    | 14.49%                                               |
| Thief        | 113    | 12.40%                                               |
| Warrior      | 142    | 15.59% *                                             |
| ------------ | ------ | ----------                                           |
| TOTALS:      | 911    | 100%                                                 |
|                                                                              |
|------------------------------------------------------------------------------|
| (TRADESKILL)                                                                 |
|                                                                              |
| NAME          | PIXELS | PERCENTAGE                                          |
| -----------------------------------                                          |
| Armorsmith    | 93     | 10.74%                                              |
| Artificer     | 71     |  8.20%                                              |
| Chef          | 117    | 13.51%                                              |
| Huntsman      | 93     | 10.74%                                              |
| Jeweler       | 117    | 13.51%                                              |
| Leatherworker | 117    | 13.51%                                              |
| Tailor        | 117    | 13.51%                                              |
| Weaponsmith   | 141    | 16.28% *                                            |
| ------------- | ------ | ----------                                          |
| TOTALS:       | 866    | 100%                                                |
|                                                                              |
\******************************************************************************/

/******************************************************************************\
| Global Variables                                                             |
\******************************************************************************/
var data_array = {
    gender: [
        ["male", 63],
        ["female", 37]
    ],
    race: [
        ["asura", 15.31],
        ["charr", 14.32],
        ["human", 34.81],
        ["norn", 20.25],
        ["sylvari", 15.31]
    ],
    profession: [
        [10.21, 10.21, 11.31, 12.40, 12.40, 13.39, 14.49, 15.59],
        ["Engineer", "Mesmer", "Necromancer", "Guardian",
        "Thief", "Elementalist", "Ranger", "Warrior"]
    ],
    tradeskill: [
        [8.2, 10.74, 10.74, 13.51, 13.51, 13.51, 13.51, 16.28],
        ["Artificer", "Armorsmith", "Huntsman", "Chef",
        "Jeweler", "Leatherworker", "Tailor", "Weaponsmith"],
        ['#68c7ff', '#eca539', '#d9824d', '#a6a638',
        '#4ab3d1', '#87aa66', '#87aaac', '#d84e4c']
    ]
};


/******************************************************************************\
| Init                                                                         |
\******************************************************************************/
function central_init(){
    create_gender_race_chart();
    create_profession_chart();
    create_tradeskill_chart();
}

/******************************************************************************\
| Global Functions                                                             |
\******************************************************************************/
function create_gender_race_chart(){
    var gender_data = data_array['gender'],
        gender_data_length = gender_data.length,
        formatted_gender_data = [],
        gender_width = 320,
        gender_height = 320,
        gender_radius = Math.min(gender_width, gender_height) / 2,
        gender_color = d3.scale.category20()
            .range(['#c30b0b', '#ffa10d']),
        gender_donut = d3.layout.pie().sort(null),
        gender_arc = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(gender_radius),
        race_data = data_array['race'],
        race_data_length = race_data.length,
        formatted_race_data = [],
        race_width = 650,
        race_height = 650,
        race_radius = Math.min(race_width, race_height) / 2,
        race_color = d3.scale.ordinal()
            .domain(['asura',
                    'charr',
                    'human',
                    'norn',
                    'sylvari'])
            .range(['#eca539',
                    '#d9834a',
                    '#87aa66',
                    '#d84c4b',
                    '#a6a638']),
        race_donut = d3.layout.pie().sort(null),
        race_arc = d3.svg.arc()
            .innerRadius(race_radius - 160)
            .outerRadius(race_radius);

    for(i = 0; i < gender_data_length; i += 1){
        formatted_gender_data.push(gender_data[i][1]);
    }
    for(i = 0; i < race_data_length; i += 1){
        formatted_race_data.push(race_data[i][1]);
    }

    var race_svg = d3.select("#race_donut")
        .append("svg:svg")
        .attr("width", race_width)
        .attr("height", race_height)
        .append("svg:g")
        .attr("transform", "translate(" + (race_width / 2) + "," + (race_height / 2) + ")");
    
    var race_list_color = ['#eca539', '#d9834a', '#87aa66', '#d84c4b', '#a6a638'];

    var race_arcs = race_svg.selectAll("path")
        .data(race_donut(formatted_race_data))
        .enter()
        .append("svg:path")
        .attr("fill", function(d, i) {
            return race_list_color[i];
        })
        .style("stroke", "black")
        .attr("d", race_arc);
    
    $('male_text').innerHTML = ("Male<br />" + gender_data[0][1] + "%");
    $('female_text').innerHTML = ("Female<br />" + gender_data[1][1] + "%");
    
    var gender_svg = d3.select("#gender_pie_svg")
        .append("svg:g")
        .attr("transform", "translate(" + (gender_width / 2) + "," + (gender_height / 2) + ")");

    var gender_arcs = gender_svg.selectAll("path")
        .data(gender_donut(formatted_gender_data))
        .enter()
        .append("svg:path")
        .attr("fill", function(d, i) {
            //return gender_color(i);
            console.log(i);
            if(i === 0){
                console.log('Returning Male');
                return "url(#maleGradient)";
            } else {
                console.log('Returning Female');
                return "url(#femaleGradient)";
            }
        })
        .style("stroke", "black")
        .style("filter", "url(#waterColor1)")
        .attr("d", gender_arc);
    
    $('asura_text').innerHTML = (race_data[0][0] + "<br />" + race_data[0][1] + "%");
    $('charr_text').innerHTML = (race_data[1][0] + "<br />" + race_data[1][1] + "%");
    $('human_text').innerHTML = (race_data[2][0] + "<br />" + race_data[2][1] + "%");
    $('norn_text').innerHTML = (race_data[3][0] + "<br />" + race_data[3][1] + "%");
    $('sylvari_text').innerHTML = (race_data[4][0] + "<br />" + race_data[4][1] + "%");
}
function create_profession_chart(){
    var profession_data = data_array['profession'],
        profession_numbers = profession_data[0],
        profession_numbers_length = profession_numbers.length,
        profession_names = profession_data[1],
        profession_colors = [
            '#d84e4c',
            '#87aa66',
            '#87aaac',
            '#4ab3d1',
            '#d9824d',
            '#eca539',
            '#68c7ff',
            '#a6a638'
            ],
        bar_length = 300,
        height = 650,
        bar_height = (height / profession_numbers_length);

    var profession_chart = d3.select("#profession_chart")
        .append("svg:svg")
        .attr("width", bar_length)
        .attr("height", height);

    var x_scale = d3.scale.linear()
        .domain([0, d3.max(profession_numbers)])
        .range([0, bar_length]);

    profession_chart.selectAll("rect")
        .data(profession_numbers)
        .enter()
        .append("svg:rect")
        .attr("y", function(d, i) {
            return (i * bar_height); })
        .attr("width", x_scale)
        .style("stroke", "black")
        .attr("height", bar_height - 5)
        .style("fill", function(d, i) {
            return (profession_colors[i]);
        });
    
    profession_chart.selectAll("text")
        .data(profession_numbers)
        .enter()
        .append("svg:text")
        .attr("x", x_scale)
        .attr("y", function(d, i) {
            return (i * bar_height + 40); })
        .attr("dx", -10)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .style("font-size", "1.2em")
        .style("font-family", "IM Fell French Canon SC")
        .text(function(d,i) {
            return (profession_names[i] + ": " + d + "%");
        });

}
function create_tradeskill_chart(){
    var tradeskill_data = data_array['tradeskill'],
        tradeskill_numbers = tradeskill_data[0],
        tradeskill_numbers_length = tradeskill_numbers.length,
        tradeskill_names = tradeskill_data[1],
        tradeskill_colors = tradeskill_data[2],
        bar_length = 300,
        height = 650,
        bar_height = (height / tradeskill_numbers_length);

    var tradeskill_chart = d3.select("#tradeskill_chart")
        .append("svg:svg")
        .attr("width", bar_length)
        .attr("height", height);

    var x_scale = d3.scale.linear()
        .domain([0, d3.max(tradeskill_numbers)])
        .range([0, bar_length]);

    tradeskill_chart.selectAll("rect")
        .data(tradeskill_numbers)
        .enter()
        .append("svg:rect")
        .attr("y", function(d, i) {
            return (i * bar_height); })
        .attr("width", x_scale)
        .attr("x", function(d, i){
            return (bar_length - x_scale(d));
        })
        .style("stroke", "black")
        .attr("height", bar_height - 5)
        .style("fill", function(d, i) {
            return (tradeskill_colors[i]);
        });
    
    tradeskill_chart.selectAll("text")
        .data(tradeskill_numbers)
        .enter()
        .append("svg:text")
        .attr("x", function(d) {
            return (bar_length - x_scale(d) + 20);
        })
        .attr("y", function(d, i) {
            return (i * bar_height + 40); })
        .attr("dx", -10)
        .attr("dy", ".35em")
        .attr("text-anchor", "front")
        .style("font-size", "1.1em")
        .style("font-family", "IM Fell French Canon SC")
        .text(function(d,i) {
            return (tradeskill_names[i] + ": " + d + "%");
        });

}
