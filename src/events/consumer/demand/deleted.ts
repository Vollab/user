import { demand_stream } from 'common/global/streams'
import { Consumer } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class DemandDeletedConsumer extends Consumer {
	private static _instance: DemandDeletedConsumer = new DemandDeletedConsumer()

	protected stream = demand_stream
	readonly subject = Subjects.DemandDeleted
	readonly durable_name = 'Vacancy:DemandDeleted'
	readonly queue_group = 'queue'

	static get instance() {
		return this._instance
	}
}

const instance = DemandDeletedConsumer.instance
export { instance as demand_deleted_consumer }
