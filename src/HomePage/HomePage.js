import React, { useEffect, useRef } from "react";
import axios from "axios";
import {
  Chart,
  PieController,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import * as d3 from "d3";

Chart.register(PieController, CategoryScale, ArcElement, Tooltip, Legend);

function HomePage() {
  const chartRef = useRef(null);
  const d3ChartRef = useRef(null);

  const myChartRef = useRef(null);

  useEffect(() => {
    const dataSource = {
      datasets: [
        {
          data: [],
          backgroundColor: [
            "#ffcd56",
            "#ff6384",
            "#36a2eb",
            "#fd6b19",
            "#8E33FF",
            "#33FF57",
            "#5733FF",
            "#FF33F1",
          ],
        },
      ],
      labels: [],
    };

    function createChart() {
      if (chartRef.current) {
        if (myChartRef.current) {
          myChartRef.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        myChartRef.current = new Chart(ctx, {
          type: "pie",
          data: dataSource,
        });
      }
    }

    function createD3JSChart() {
      if (d3ChartRef.current) {
        const width = 800;
        const height = 300;
        const radius = Math.min(width, height) / 2;
        const legendWidth = 100;
        const spaceBetweenLegendAndChart = 50;

        const data = dataSource.datasets[0].data;
        const labels = dataSource.labels;
        const color = d3.scaleOrdinal(dataSource.datasets[0].backgroundColor);

        const svg = d3
          .select("#donutChart")
          .attr("width", width)
          .attr("height", height + spaceBetweenLegendAndChart);

        const g = svg
          .append("g")
          .attr(
            "transform",
            "translate(" +
              width / 2 +
              "," +
              (height / 2 + spaceBetweenLegendAndChart) +
              ")"
          );

        const pieData = labels.map((label, i) => ({
          title: label,
          value: data[i],
        }));

        const pie = d3.pie().value(function (d) {
          return d.value;
        })(pieData);

        const path = d3
          .arc()
          .outerRadius(radius - 10)
          .innerRadius(radius - 70);

        const arc = g
          .selectAll(".arc")
          .data(pie)
          .enter()
          .append("g")
          .attr("class", "arc");

        arc
          .append("path")
          .attr("d", path)
          .attr("fill", function (d) {
            return color(d.data.title);
          });

        const legend = svg
          .selectAll(".legend")
          .data(labels)
          .enter()
          .append("g")
          .attr("class", "legend")
          .attr("transform", function (d, i) {
            return "translate(" + i * legendWidth + ",0)";
          });

        legend
          .append("rect")
          .attr("x", 0)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

        legend
          .append("text")
          .attr("x", 22)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .text(function (d) {
            return d;
          });
      }
    }

    function getBudget() {
      axios.get("http://localhost:8000/budget").then(function (res) {
        for (let i = 0; i < res.data.myBudget.length; i++) {
          dataSource.datasets[0].data[i] = res.data.myBudget[i].budget;
          dataSource.labels[i] = res.data.myBudget[i].title;
        }
        createChart();
        createD3JSChart();
      });
    }

    getBudget();

    return () => {
      if (myChartRef.current) {
        myChartRef.current.destroy();
      }
    };
  }, []);

  return (
    <main className="center" id="main">
      <section className="page-area">
        <article>
          <h1>Stay on track</h1>
          <p>
            Do you know where you are spending your money? If you really stop to
            track it down, you would get surprised! Proper budget management
            depends on real data... and this app will help you with that!
          </p>
        </article>

        <article>
          <h1>Alerts</h1>
          <p>
            What if your clothing budget ended? You will get an alert. The goal
            is to never go over the budget.
          </p>
        </article>

        <article>
          <h1>Results</h1>
          <p>
            People who stick to a financial plan, budgeting every expense, get
            out of debt faster! Also, they to live happier lives... since they
            expend without guilt or fear... because they know it is all good and
            accounted for.
          </p>
        </article>

        <article>
          <h1>Free</h1>
          <p>This app is free!!! And you are the only one holding your data!</p>
        </article>

        <article>
          <h1>Stay on track</h1>
          <p>
            Do you know where you are spending your money? If you really stop to
            track it down, you would get surprised! Proper budget management
            depends on real data... and this app will help you with that!
          </p>
        </article>

        <article>
          <h1>Alerts</h1>
          <p>
            What if your clothing budget ended? You will get an alert. The goal
            is to never go over the budget.
          </p>
        </article>

        <article>
          <h1>Results</h1>
          <p>
            People who stick to a financial plan, budgeting every expense, get
            out of debt faster! Also, they to live happier lives... since they
            expend without guilt or fear... because they know it is all good and
            accounted for.
          </p>
        </article>
      </section>

      <h1>Chart</h1>

      <div class="container">
        <figure>
          <canvas ref={chartRef} width="400" height="400"></canvas>
          <figcaption>Visualization of personal budget distribution</figcaption>
        </figure>
      </div>

      <h1>D3JS Chart</h1>
      <figure>
        <svg ref={d3ChartRef} width="600" height="600" id="donutChart"></svg>
        <figcaption>D3JS Chart Visualization</figcaption>
      </figure>
    </main>
  );
}

export default HomePage;
