import { demand_stream } from 'common/global/streams'
import { Consumer } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class DemandUpdatedConsumer extends Consumer {
	private static _instance: DemandUpdatedConsumer = new DemandUpdatedConsumer()

	protected stream = demand_stream
	readonly subject = Subjects.DemandUpdated
	readonly durable_name = 'Vacancy:DemandUpdated'
	readonly queue_group = 'queue'

	static get instance() {
		return this._instance
	}
}

const instance = DemandUpdatedConsumer.instance
export { instance as demand_updated_consumer }
