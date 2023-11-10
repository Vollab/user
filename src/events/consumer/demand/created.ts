import { demand_stream } from 'common/global/streams'
import { Consumer } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class DemandCreatedConsumer extends Consumer {
	private static _instance: DemandCreatedConsumer = new DemandCreatedConsumer()

	protected stream = demand_stream
	readonly subject = Subjects.DemandCreated
	readonly durable_name = 'Vacancy:DemandCreated'
	readonly queue_group = 'queue'

	static get instance() {
		return this._instance
	}
}

const instance = DemandCreatedConsumer.instance
export { instance as demand_created_consumer }
