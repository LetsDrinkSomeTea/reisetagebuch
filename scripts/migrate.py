import os, yaml, re, subprocess, shutil
from pathlib import Path

def parse_front_matter(text):
    if text.startswith('---'):
        _, fm, content = text.split('---', 2)
        fm_yaml = yaml.safe_load(fm)
        return fm_yaml, content.lstrip('\n')
    return {}, text

def dump_front_matter(fm, content):
    return '---\n'+yaml.safe_dump(fm, sort_keys=False)+'---\n\n'+content

root = Path('.')
journey_dirs = [p for p in root.iterdir() if p.is_dir() and p.name in ['japan','australien']]
for jdir in journey_dirs:
    # gather posts
    posts = []
    for tag_file in jdir.glob('*/tag-*.md'):
        text = tag_file.read_text()
        fm, content = parse_front_matter(text)
        date = fm.get('date')
        city = fm.get('city')
        day = fm.get('day')
        posts.append({'file': tag_file, 'fm': fm, 'content': content, 'date': date, 'city': city, 'day': day})
    posts.sort(key=lambda x: x['date'])
    for idx, post in enumerate(posts, start=1):
        fm = post['fm']
        content = post['content']
        old_day = fm.pop('day', None)
        journey_name = jdir.name
        fm['journey'] = journey_name
        fm['index'] = idx
        city = fm.get('city')
        if isinstance(city, str):
            fm['city'] = [city]
        # update image paths in content
        content = re.sub(r"\{\{ site.baseurl \}\}/\{\{ page.country \}\}/\{\{ page.city \}\}/tag-\{\{ page.day \}\}",
                         "{{ site.baseurl }}/{{ page.journey }}/tag-{{ page.index }}", content)
        new_path = jdir / f'tag-{idx}.md'
        # write updated file to temporary before moving
        temp_text = dump_front_matter(fm, content)
        tag_file = post['file']
        tag_file.write_text(temp_text)
        # move file
        subprocess.run(['git','mv',str(tag_file),str(new_path)])
        # move images
        if old_day is not None and fm['city']:
            city_dir = fm['city'][0]
            old_img_dir = jdir / city_dir / f'tag-{old_day}'
            if old_img_dir.exists():
                new_img_dir = jdir / f'tag-{idx}'
                subprocess.run(['git','mv',str(old_img_dir),str(new_img_dir)])
    # remove city directories after moving index files later
