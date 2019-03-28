<script>
import { Pie, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Pie,
  mixins: [reactiveProp],
  props: ['options', 'height'],
  mounted () {
    let labels = this.chartData.datasets.map(c => c.label)
    let values = this.chartData.datasets.map(c => c.data.reduce((a, b) => a + b, 0))
    this.renderChart({
      labels,
      datasets: [
        {
          backgroundColor: this.chartData.datasets.map(d => d.backgroundColor),
          data: values
        }
      ]
    }, this.options)
  }
}
</script>
