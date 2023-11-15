import { JsMsg } from 'nats'

import { demand_updated_consumer } from '../consumer'
import { demand_model } from '../../models'

import { DemandUpdatedEvent } from 'common/types/events/demand'
import { Subscriber } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class DemandUpdatedSub extends Subscriber<DemandUpdatedEvent> {
	private static _instance: DemandUpdatedSub = new DemandUpdatedSub()

	protected consumer = demand_updated_consumer

	readonly subject = Subjects.DemandUpdated

	static get instance() {
		return this._instance
	}

	async onMessage(msg: JsMsg) {
		const { id, status, updated_at } = this.parseMessage(msg.data)

		await demand_model.update(id, { status, updated_at })

		msg.ack()
	}
}

const instance = DemandUpdatedSub.instance
export { instance as demand_updated_sub }
