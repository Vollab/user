import { candidate_stream } from 'common/global/streams'
import { Consumer } from 'common/services/nats'
import { Subjects } from 'common/types/events'

class CandidateUpdatedConsumer extends Consumer {
	private static _instance: CandidateUpdatedConsumer = new CandidateUpdatedConsumer()

	protected stream = candidate_stream
	readonly subject = Subjects.CandidateUpdated
	readonly durable_name = 'Vacancy:CandidateUpdated'
	readonly queue_group = 'queue'

	static get instance() {
		return this._instance
	}
}

const instance = CandidateUpdatedConsumer.instance
export { instance as candidate_updated_consumer }
