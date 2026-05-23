FROM perl:5.40-bookworm AS builder

RUN cpanm --notest Plagger && \
    cpanm --notest Plagger::Plugin::Filter::Deduped && \
    cpanm --notest Plagger::Plugin::Filter::Rule && \
    cpanm --notest Plagger::Plugin::Publish::Gmail && \
    rm -rf /root/.cpanm

FROM perl:5.40-slim-bookworm

COPY --from=builder /usr/local /usr/local

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates libnet-smtp-ssl-perl libio-socket-ssl-perl \
    && rm -rf /var/lib/apt/lists/*

# CustomFeed::Config — wraps Subscription::Config for event-crawler
RUN mkdir -p /app/lib/Plagger/Plugin/CustomFeed && \
    cat > /app/lib/Plagger/Plugin/CustomFeed/Config.pm << 'PERL'
package Plagger::Plugin::CustomFeed::Config;
use strict;
use warnings;
use base qw(Plagger::Plugin::Subscription::Config);
1;
PERL

ENV PERL5LIB=/app/lib:$PERL5LIB
WORKDIR /workspace

ENTRYPOINT ["plagger"]
CMD ["-c", "/workspace/config.yaml"]
