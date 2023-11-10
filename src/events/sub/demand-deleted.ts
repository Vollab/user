import { JsMsg } from 'nats'

import { demand_deleted_consumer } from '../consumer'
import { demand_model } from '../../models'

import { DemandDeletedEvent } from 'common/types/events/demand'
import { Subscriber } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class DemandDeletedSub extends Subscriber<DemandDeletedEvent> {
	private static _instance: DemandDeletedSub = new DemandDeletedSub()

	protected consumer = demand_deleted_consumer

	readonly subject = Subjects.DemandDeleted

	static get instance() {
		return this._instance
	}

	async onMessage(msg: JsMsg) {
		const { id } = this.parseMessage(msg.data)

		await demand_model.delete(id)

		msg.ack()
	}
}

const instance = DemandDeletedSub.instance
export { instance as demand_updated_sub }
