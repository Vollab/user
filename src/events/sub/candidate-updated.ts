import { JsMsg } from 'nats'

import { candidate_updated_consumer } from '../consumer'
import { candidate_model } from '../../models'

import { CandidateUpdatedEvent } from 'common/types/events/candidate'
import { Subscriber } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class CandidateUpdatedSub extends Subscriber<CandidateUpdatedEvent> {
	private static _instance: CandidateUpdatedSub = new CandidateUpdatedSub()

	protected consumer = candidate_updated_consumer

	readonly subject = Subjects.CandidateUpdated

	static get instance() {
		return this._instance
	}

	async onMessage(msg: JsMsg) {
		const { id, name } = this.parseMessage(msg.data)

		await candidate_model.update(id, { name })

		msg.ack()
	}
}

const instance = CandidateUpdatedSub.instance
export { instance as candidate_updated_sub }
