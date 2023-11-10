import { JsMsg } from 'nats'

import { demand_created_consumer } from '../consumer'
import { demand_model } from '../../models'

import { DemandCreatedEvent } from 'common/types/events/demand'
import { Subscriber } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class DemandCreatedSub extends Subscriber<DemandCreatedEvent> {
	private static _instance: DemandCreatedSub = new DemandCreatedSub()

	protected consumer = demand_created_consumer

	readonly subject = Subjects.DemandCreated

	static get instance() {
		return this._instance
	}

	async onMessage(msg: JsMsg) {
		const { id, orderer_id, status } = this.parseMessage(msg.data)

		await demand_model.insert({ id, orderer_id, status })

		msg.ack()
	}
}

const instance = DemandCreatedSub.instance
export { instance as demand_created_sub }
